import { MigrationInterface, QueryRunner } from 'typeorm';

export class createPromotionCodeTable1642378192911 implements MigrationInterface {
  name = 'createPromotionCodeTable1642378192911';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "promotion_code" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "code" character varying NOT NULL, "value" integer NOT NULL, "is_actived" boolean NOT NULL DEFAULT false, "expires_date" TIMESTAMP, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, CONSTRAINT "PK_c8f0e92fe164ab3e9fd126a025c" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "promotion_code"`);
  }
}
