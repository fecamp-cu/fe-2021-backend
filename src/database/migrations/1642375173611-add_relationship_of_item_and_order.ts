import { MigrationInterface, QueryRunner } from 'typeorm';

export class addRelationshipOfItemAndOrder1642375173611 implements MigrationInterface {
  name = 'addRelationshipOfItemAndOrder1642375173611';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "order_items_item" ("orderId" integer NOT NULL, "itemId" integer NOT NULL, CONSTRAINT "PK_bcabdedbdb5a0a82b7ea791e407" PRIMARY KEY ("orderId", "itemId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_98444c0ad52b9e6e2b1f8f1a7d" ON "order_items_item" ("orderId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_beae103ca77096a308d911bc0b" ON "order_items_item" ("itemId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items_item" ADD CONSTRAINT "FK_98444c0ad52b9e6e2b1f8f1a7df" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items_item" ADD CONSTRAINT "FK_beae103ca77096a308d911bc0b8" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_items_item" DROP CONSTRAINT "FK_beae103ca77096a308d911bc0b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items_item" DROP CONSTRAINT "FK_98444c0ad52b9e6e2b1f8f1a7df"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_beae103ca77096a308d911bc0b"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_98444c0ad52b9e6e2b1f8f1a7d"`);
    await queryRunner.query(`DROP TABLE "order_items_item"`);
  }
}
