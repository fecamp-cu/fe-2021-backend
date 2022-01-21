import { MigrationInterface, QueryRunner } from 'typeorm';

export class createItemsTable1642373168303 implements MigrationInterface {
  name = 'createItemsTable1642373168303';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "item" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "image_url" character varying NOT NULL, "file_url" character varying NOT NULL, "price" smallint NOT NULL, "title" character varying NOT NULL, "summary" character varying NOT NULL, "author" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "item"`);
  }
}
