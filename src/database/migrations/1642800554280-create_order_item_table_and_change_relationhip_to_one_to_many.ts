import { MigrationInterface, QueryRunner } from 'typeorm';

export class createOrderItemTableAndChangeRelationhipToOneToMany1642800554280
  implements MigrationInterface
{
  name = 'createOrderItemTableAndChangeRelationhipToOneToMany1642800554280';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "order_item" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, "itemId" integer, "orderId" integer, CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_e03f3ed4dab80a3bf3eca50babc" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_e03f3ed4dab80a3bf3eca50babc"`,
    );
    await queryRunner.query(`DROP TABLE "order_item"`);
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
}
