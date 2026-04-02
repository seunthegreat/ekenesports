import { All, Controller, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { auth } from '@ekene/auth/server';

import { toNodeHandler } from 'better-auth/node';

@Controller('api/auth')
export class BetterAuthController {
  @All('*path')
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    console.log(`[BetterAuth] Request received from Origin: ${req.headers.origin}, Host: ${req.headers.host}`);
    return toNodeHandler(auth)(req, res);
  }
}
