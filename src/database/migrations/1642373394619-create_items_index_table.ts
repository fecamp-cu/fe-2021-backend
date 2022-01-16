import { MigrationInterface, QueryRunner } from 'typeorm';

export class createItemsIndexTable1642373394619 implements MigrationInterface {
  name = 'createItemsIndexTable1642373394619';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "item_index" ("id" SERIAL NOT NULL, "order" smallint NOT NULL, "text" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, CONSTRAINT "PK_014a1ca70d5c67c7724dd6a3b7a" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "item_index"`);
  }
}
