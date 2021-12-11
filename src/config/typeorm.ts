import * as dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';

const envType = process.env.MODE_ENV || 'development';

dotenv.config({ path: `.env.${envType}` });

const options: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DATABSE_HOST,
  port: parseInt(process.env.DATABSE_PORT) || 5432,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  synchronize: false,
  entities: ['src/**/entities/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};

export = options;
