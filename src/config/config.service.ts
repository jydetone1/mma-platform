import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    const envFile =
      process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
    this.envConfig = dotenv.parse(fs.readFileSync(envFile));
    Object.assign(this.envConfig, process.env);
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
