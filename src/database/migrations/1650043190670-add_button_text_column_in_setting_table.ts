import { MigrationInterface, QueryRunner } from 'typeorm';

export class addButtonTextColumnInSettingTable1650043190670 implements MigrationInterface {
  name = 'addButtonTextColumnInSettingTable1650043190670';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "setting" ADD "button_text" character varying NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "button_text"`);
  }
}
