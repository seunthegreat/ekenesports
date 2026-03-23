import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Ekene Sport API — All Systems Operational';
  }
}
