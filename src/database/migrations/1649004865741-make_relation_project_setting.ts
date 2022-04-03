import { MigrationInterface, QueryRunner } from 'typeorm';

export class makeRelationProjectSetting1649004865741 implements MigrationInterface {
  name = 'makeRelationProjectSetting1649004865741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project" ADD "settingId" integer`);
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "UQ_3149e1b9d773f4e66f11a255556" UNIQUE ("settingId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_3149e1b9d773f4e66f11a255556" FOREIGN KEY ("settingId") REFERENCES "setting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_3149e1b9d773f4e66f11a255556"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "UQ_3149e1b9d773f4e66f11a255556"`,
    );
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "settingId"`);
  }
}
