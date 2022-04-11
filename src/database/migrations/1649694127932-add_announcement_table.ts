import {MigrationInterface, QueryRunner} from "typeorm";

export class addAnnouncementTable1649694127932 implements MigrationInterface {
    name = 'addAnnouncementTable1649694127932'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "announcement" ("id" SERIAL NOT NULL, "date_start" TIMESTAMP NOT NULL, "date_end" TIMESTAMP NOT NULL, "header" character varying NOT NULL, "description" character varying NOT NULL, "order" integer NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, "settingId" integer, CONSTRAINT "PK_e0ef0550174fd1099a308fd18a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "setting" ADD "publish_date" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "setting" ADD "end_date" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "announcement" ADD CONSTRAINT "FK_c9cf3cb4c6ad9938c61ce4dd6a8" FOREIGN KEY ("settingId") REFERENCES "setting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "announcement" DROP CONSTRAINT "FK_c9cf3cb4c6ad9938c61ce4dd6a8"`);
        await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "end_date"`);
        await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "publish_date"`);
        await queryRunner.query(`DROP TABLE "announcement"`);
    }

}
