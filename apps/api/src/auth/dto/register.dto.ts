import { IsEmail, IsNotEmpty, IsString, IsOptional, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'CUSTOMER', description: 'User role', enum: Role })
  @IsEnum(Role)
  @IsOptional()
  role?: Role = Role.CUSTOMER;

  @ApiProperty({ description: 'User first name' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ description: 'User last name' })
  @IsString()
  @IsOptional()
  lastName?: string;
}
