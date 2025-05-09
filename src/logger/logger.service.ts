import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  log(message: string) {
    console.log(`[LOGGER] ${message}`);
  }

  error(message: string) {
    console.error(`[ERROR] ${message}`);
  }
}
