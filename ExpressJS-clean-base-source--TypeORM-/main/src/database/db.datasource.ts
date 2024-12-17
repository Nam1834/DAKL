import 'dotenv/config';
import { Account } from '../models/account.model';
import { Role } from '../models/role.model';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { GlobalConfig } from '@/utils/config/global-config.util';
import { User } from '@/models/user.model';
import { UserProfile } from '@/models/user_profile.model';
import { Admin } from '@/models/admin.model';
import { AdminProfile } from '@/models/admin_profile.model';

const models = [Account, Role, User, UserProfile, Admin, AdminProfile];

export class AppDataSourceSingleton {
  private static instance: DataSource;

  private constructor() {}

  public static getInstance(): DataSource {
    if (!AppDataSourceSingleton.instance) {
      AppDataSourceSingleton.instance = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'admin',
        database: process.env.DB_NAME || 'test',
        entities: models,
        synchronize: GlobalConfig.database.sync,
        logging: true,
        migrations: [__dirname + '/migrations/*.js']
      });
    }
    return AppDataSourceSingleton.instance;
  }
}

export const AppDataSource = AppDataSourceSingleton.getInstance();
