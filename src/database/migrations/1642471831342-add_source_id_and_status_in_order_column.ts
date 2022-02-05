import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSourceIdAndStatusInOrderColumn1642471831342 implements MigrationInterface {
  name = 'addSourceIdAndStatusInOrderColumn1642471831342';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "chargeId"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "transactionId"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "paymentMethod"`);
    await queryRunner.query(`ALTER TABLE "order" ADD "source_id" character varying`);
    await queryRunner.query(`ALTER TABLE "order" ADD "charge_id" character varying`);
    await queryRunner.query(`ALTER TABLE "order" ADD "transaction_id" character varying`);
    await queryRunner.query(`ALTER TABLE "order" ADD "payment_method" character varying`);
    await queryRunner.query(
      `ALTER TABLE "order" ADD "status" character varying NOT NULL DEFAULT 'pending'`,
    );
    await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "paid_at" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "paid_at" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "payment_method"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "transaction_id"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "charge_id"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "source_id"`);
    await queryRunner.query(`ALTER TABLE "order" ADD "paymentMethod" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "order" ADD "transactionId" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "order" ADD "chargeId" character varying NOT NULL`);
  }
}
