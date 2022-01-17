import { MigrationInterface, QueryRunner } from 'typeorm';

export class createOrdersTable1642374825152 implements MigrationInterface {
  name = 'createOrdersTable1642374825152';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "order" ("id" SERIAL NOT NULL, "chargeId" character varying NOT NULL, "transactionId" character varying NOT NULL, "paymentMethod" character varying NOT NULL, "amount" integer NOT NULL, "paid_at" TIMESTAMP NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "order"`);
  }
}
