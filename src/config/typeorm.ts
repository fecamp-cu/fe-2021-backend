import * as dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';

const envType = process.env.MODE_ENV || 'development';

dotenv.config({ path: `.env.${envType}` });

type ConnectionOptionsWithSeed = ConnectionOptions & {
  seeds: string[];
  factories: string[];
};

const options: ConnectionOptionsWithSeed = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  synchronize: false,
  entities: [process.env.ENTITY_PATH],
  migrations: [process.env.MIGRATION_PATH],
  seeds: [process.env.SEEDS_PATH],
  factories: [process.env.FATORIES_PATH],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};

export = options;
