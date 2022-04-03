import { MigrationInterface, QueryRunner } from 'typeorm';

export class createProjectTable1649004283951 implements MigrationInterface {
  name = 'createProjectTable1649004283951';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "publish_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contact" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying, "tel" character varying, "contact_type" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, "projectId" integer, CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact" ADD CONSTRAINT "FK_2c814094361b215f3bd4d11d0c9" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contact" DROP CONSTRAINT "FK_2c814094361b215f3bd4d11d0c9"`,
    );
    await queryRunner.query(`DROP TABLE "contact"`);
    await queryRunner.query(`DROP TABLE "project"`);
  }
}
