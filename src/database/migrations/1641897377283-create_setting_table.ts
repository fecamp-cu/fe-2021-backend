import { MigrationInterface, QueryRunner } from 'typeorm';

export class createSettingTable1641897377283 implements MigrationInterface {
  name = 'createSettingTable1641897377283';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "setting" ("id" integer NOT NULL, "youtube_url" character varying NOT NULL, "register_form_url" character varying NOT NULL, "is_active" boolean NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, CONSTRAINT "PK_fcb21187dc6094e24a48f677bed" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "setting"`);
  }
}
