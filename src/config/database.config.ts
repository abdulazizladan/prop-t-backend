import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const nodeEnv = configService.get('NODE_ENV', 'development');
  
  // Use SQLite for development, MySQL for production
  if (nodeEnv === 'development') {
    return {
      type: 'sqlite',
      database: 'app/database.sqlite',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    };
  }
  
  // Production MySQL configuration
  return {
    type: 'mysql',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 3306),
    username: configService.get('DB_USERNAME', 'root'),
    password: configService.get('DB_PASSWORD', ''),
    database: configService.get('DB_DATABASE', 'prop_t'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false, // Never auto-sync in production
    logging: false,
    charset: 'utf8mb4',
    timezone: 'Z',
    extra: {
      connectionLimit: 10,
      acquireTimeout: 60000,
      timeout: 60000,
      reconnect: true,
    },
  };
};
