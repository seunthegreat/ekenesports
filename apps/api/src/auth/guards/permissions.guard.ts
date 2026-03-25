import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { PERMISSIONS_KEY, ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
    ]);

    if (!requiredPermissions && !requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }

    const userRole = user.role as Role;

    // Check Roles first (Simple RBAC)
    if (requiredRoles && requiredRoles.length > 0) {
        if (!requiredRoles.includes(userRole)) {
            // Check hierarchy if needed, but here we check explicit roles or Super Admin
            if (userRole !== Role.SUPER_ADMIN) {
                throw new ForbiddenException('Insufficient role');
            }
        }
    }

    // Check Granular Permissions
    if (requiredPermissions && requiredPermissions.length > 0) {
        const hasPermission = requiredPermissions.every(permission => 
            this.checkPermission(userRole, permission)
        );

        if (!hasPermission) {
            throw new ForbiddenException('You do not have the required permissions');
        }
    }

    return true;
  }

  private checkPermission(role: Role, permission: string): boolean {
      const [resource, action] = permission.split(':');
      
      const rolePermissions: Record<Role, Record<string, string[]>> = {
          [Role.SUPER_ADMIN]: {
              PRODUCTS: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
              ORDERS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'REFUND'],
              CUSTOMERS: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
              SHIPPING: ['ALL'],
              USERS: ['MANAGE'],
          },
          [Role.ADMIN]: {
              PRODUCTS: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
              ORDERS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'REFUND'],
              CUSTOMERS: ['READ', 'UPDATE'],
              SHIPPING: ['ZONES'],
              USERS: ['READ'],
          },
          [Role.STAFF]: {
              PRODUCTS: ['READ', 'UPDATE'],
              ORDERS: ['READ', 'STATUS'],
              CUSTOMERS: ['READ'],
              SHIPPING: [],
              USERS: [],
          },
          [Role.CUSTOMER]: {
              PRODUCTS: ['READ'],
              ORDERS: ['OWN'], 
              CUSTOMERS: [],
              SHIPPING: [],
              USERS: [],
          }
      };

      const permissions = rolePermissions[role]?.[resource] || [];
      
      // Super Admin escape hatch
      if (role === Role.SUPER_ADMIN) return true;

      // Check for exact action or 'ALL'
      return permissions.includes(action) || permissions.includes('ALL');
  }
}
