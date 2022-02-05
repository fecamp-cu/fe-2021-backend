import { MigrationInterface, QueryRunner } from 'typeorm';

export class addColumnQuantityInStockInItemTable1643516835010 implements MigrationInterface {
  name = 'addColumnQuantityInStockInItemTable1643516835010';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item" ADD "quantity_in_stock" smallint NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "quantity_in_stock"`);
  }
}
