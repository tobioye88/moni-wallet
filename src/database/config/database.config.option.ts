import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class DatabaseConfigOption implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    const DATABASE_URI =
      this.configService.get<string>('NODE_ENV') === 'DEVELOPMENT'
        ? this.configService.get<string>('DATABASE_URI_DEV')
        : this.configService.get<string>('DATABASE_URI_PROD');
    return {
      uri: DATABASE_URI,
    };
  }
}
