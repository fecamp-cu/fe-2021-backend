import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUserTable1641311938182 implements MigrationInterface {
  name = 'createUserTable1641311938182';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "tel" integer NOT NULL, "email" character varying NOT NULL, "grade" character varying NOT NULL, "school" character varying NOT NULL, "address" character varying NOT NULL, "sub_district" character varying NOT NULL, "district" character varying NOT NULL, "province" character varying NOT NULL, "postcode" integer NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
