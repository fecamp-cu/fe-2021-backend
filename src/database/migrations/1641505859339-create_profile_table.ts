import { MigrationInterface, QueryRunner } from 'typeorm';

export class createProfileTable1641505859339 implements MigrationInterface {
  name = 'createProfileTable1641505859339';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "profile" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "image_url" character varying, "tel" character varying NOT NULL, "grade" character varying NOT NULL, "school" character varying NOT NULL, "address" character varying NOT NULL, "sub_district" character varying NOT NULL, "district" character varying NOT NULL, "province" character varying NOT NULL, "postcode" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "profile"`);
  }
}
