import { MigrationInterface, QueryRunner } from 'typeorm';

export class addCustomerEmailColumnInOrder1642477994689 implements MigrationInterface {
  name = 'addCustomerEmailColumnInOrder1642477994689';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" ADD "customer_email" character varying NOT NULL`);
    await queryRunner.query(
      `CREATE INDEX "IDX_667be244882bfba8df068f601b" ON "order" ("customer_email") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_667be244882bfba8df068f601b"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customer_email"`);
  }
}
