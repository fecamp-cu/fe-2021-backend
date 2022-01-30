import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPointColumnToCustomerTable1643516877392 implements MigrationInterface {
  name = 'addPointColumnToCustomerTable1643516877392';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "customer" ADD "point" integer NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "point"`);
  }
}
