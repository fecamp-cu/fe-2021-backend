import { MigrationInterface, QueryRunner } from 'typeorm';

export class createValidateCodeTable1642278540713 implements MigrationInterface {
  name = 'createValidateCodeTable1642278540713';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "validate_code" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "code" character varying NOT NULL, "expired_date" TIMESTAMP, "is_used" boolean NOT NULL DEFAULT false, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, CONSTRAINT "PK_e0cd327f837e00323ddf21c97a8" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "validate_code"`);
  }
}
