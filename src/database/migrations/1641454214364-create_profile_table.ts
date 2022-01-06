import { MigrationInterface, QueryRunner } from 'typeorm';

export class createProfileTable1641454214364 implements MigrationInterface {
  name = 'createProfileTable1641454214364';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "profile" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "tel" integer NOT NULL, "grade" character varying NOT NULL, "school" character varying NOT NULL, "address" character varying NOT NULL, "sub_district" character varying NOT NULL, "district" character varying NOT NULL, "province" character varying NOT NULL, "postcode" integer NOT NULL, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "profleId" integer`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_7de9248d7db5b659f629ecf3942" UNIQUE ("profleId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_7de9248d7db5b659f629ecf3942" FOREIGN KEY ("profleId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_7de9248d7db5b659f629ecf3942"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_7de9248d7db5b659f629ecf3942"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profleId"`);
    await queryRunner.query(`DROP TABLE "profile"`);
  }
}
