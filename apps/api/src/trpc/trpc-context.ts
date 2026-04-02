import { Injectable } from '@nestjs/common';
import { TRPCContext, ContextOptions } from 'nestjs-trpc';
import { Request, Response } from 'express';
import { auth } from '@ekene/auth/server';

export interface TrpcContextPayload {
  req: Request;
  res: Response;
  session: any; // Type from Better Auth
  user: any;
  [key: string]: unknown;
}


@Injectable()
export class TrpcContextProvider implements TRPCContext {
  async create(opts: ContextOptions): Promise<TrpcContextPayload> {
    const { req, res } = opts;
    
    const session = await auth.api.getSession({
      headers: req.headers as unknown as Headers,
    });
    
    return {
      req,
      res,
      session,
      user: session?.user,
    };
  }
}


export type Context = TrpcContextPayload;


