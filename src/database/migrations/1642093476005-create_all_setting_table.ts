import { MigrationInterface, QueryRunner } from 'typeorm';

export class createAllSettingTable1642093476005 implements MigrationInterface {
  name = 'createAllSettingTable1642093476005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "qualification_preview" ("id" SERIAL NOT NULL, "order" integer NOT NULL, "text" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, "settingId" integer, CONSTRAINT "PK_f5db20a8d85b2db3d55764b6bd9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sponcer_container" ("id" SERIAL NOT NULL, "order" integer NOT NULL, "img_url" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, "settingId" integer, CONSTRAINT "PK_4c67f7efdc028ed0bc9e67478cb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "timeline_event" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "event_date" TIMESTAMP NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, "settingId" integer, CONSTRAINT "PK_8f5a66cd7151d78a419da3a3375" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "setting" ("id" SERIAL NOT NULL, "youtube_url" character varying NOT NULL, "register_form_url" character varying NOT NULL, "is_active" boolean NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, CONSTRAINT "PK_fcb21187dc6094e24a48f677bed" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "about_fe_container" ("id" SERIAL NOT NULL, "order" integer NOT NULL, "text" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, "settingId" integer, CONSTRAINT "PK_2a31fc6f0f3a196c1de077ee2c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "photo_preview" ("id" SERIAL NOT NULL, "order" integer NOT NULL, "img_url" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, "settingId" integer, CONSTRAINT "PK_b1f4b5aa3b914635504e966e84e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "qualification_preview" ADD CONSTRAINT "FK_9dfe88def1cfbf59e2a04e9e362" FOREIGN KEY ("settingId") REFERENCES "setting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sponcer_container" ADD CONSTRAINT "FK_22ed6d3113550fc0dda3cd0403c" FOREIGN KEY ("settingId") REFERENCES "setting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "timeline_event" ADD CONSTRAINT "FK_b646d243aa3109d1824b8e68a9c" FOREIGN KEY ("settingId") REFERENCES "setting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "about_fe_container" ADD CONSTRAINT "FK_ace24bd63090aed5e38407daa9f" FOREIGN KEY ("settingId") REFERENCES "setting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "photo_preview" ADD CONSTRAINT "FK_a3ee04a319d9c87568053357cc5" FOREIGN KEY ("settingId") REFERENCES "setting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "photo_preview" DROP CONSTRAINT "FK_a3ee04a319d9c87568053357cc5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "about_fe_container" DROP CONSTRAINT "FK_ace24bd63090aed5e38407daa9f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "timeline_event" DROP CONSTRAINT "FK_b646d243aa3109d1824b8e68a9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sponcer_container" DROP CONSTRAINT "FK_22ed6d3113550fc0dda3cd0403c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "qualification_preview" DROP CONSTRAINT "FK_9dfe88def1cfbf59e2a04e9e362"`,
    );
    await queryRunner.query(`DROP TABLE "photo_preview"`);
    await queryRunner.query(`DROP TABLE "about_fe_container"`);
    await queryRunner.query(`DROP TABLE "setting"`);
    await queryRunner.query(`DROP TABLE "timeline_event"`);
    await queryRunner.query(`DROP TABLE "sponcer_container"`);
    await queryRunner.query(`DROP TABLE "qualification_preview"`);
  }
}
