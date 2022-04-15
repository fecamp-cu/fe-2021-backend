import { MigrationInterface, QueryRunner } from 'typeorm';

export class addCoverImgUrlToSettingTable1650044530439 implements MigrationInterface {
  name = 'addCoverImgUrlToSettingTable1650044530439';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "setting" ADD "cover_img_url" character varying NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "cover_img_url"`);
  }
}
