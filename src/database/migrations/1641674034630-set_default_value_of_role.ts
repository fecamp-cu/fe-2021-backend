import { MigrationInterface, QueryRunner } from 'typeorm';

export class setDefaultValueOfRole1641674034630 implements MigrationInterface {
  name = 'setDefaultValueOfRole1641674034630';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`);
  }
}
