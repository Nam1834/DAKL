import 'dotenv/config';
import { Role } from '../models/role.model';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { GlobalConfig } from '@/utils/config/global-config.util';
import { User } from '@/models/user.model';
import { UserProfile } from '@/models/user_profile.model';
import { Admin } from '@/models/admin.model';
import { AdminProfile } from '@/models/admin_profile.model';
import { Permission } from '@/models/permission.model';
import { RolePermission } from '@/models/role_permission.model';
import { Notification } from '@/models/notification.model';
import { Major } from '@/models/major.model';
import { TutorProfile } from '@/models/tutor_profile.model';
import { Meeting } from '@/models/meeting.model';
import { ValueConfig } from '@/models/value_config.model';
import { Payment } from '@/models/payment.model';
import { Order } from '@/models/order.model';
import { OrderItem } from '@/models/order_item.model';
import { Curriculumn } from '@/models/curriculumn.model';
import { MyCurriculumn } from '@/models/my-curriculumn.model';
import { MyCurriculumnItem } from '@/models/my-curriculumn-item.model';
import { Subject } from '@/models/subject.model';
import { TutorLevel } from '@/models/tutor_level.model';
import { TutorSubject } from '@/models/tutor_subject.model';

const models = [
  Role,
  Permission,
  RolePermission,
  User,
  UserProfile,
  TutorProfile,
  Admin,
  AdminProfile,
  Notification,
  Major,
  Meeting,
  ValueConfig,
  Payment,
  Order,
  OrderItem,
  Curriculumn,
  MyCurriculumn,
  MyCurriculumnItem,
  Subject,
  TutorLevel
  //TutorSubject
];

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
