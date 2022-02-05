import { ConnectionOptions } from 'typeorm';

export type ConnectionOptionsWithSeed = ConnectionOptions & {
  seeds: string[];
  factories: string[];
};
