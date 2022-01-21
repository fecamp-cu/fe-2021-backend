import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeRelationshipOfUserAndItemToManyToMany1642423478238
  implements MigrationInterface
{
  name = 'changeRelationshipOfUserAndItemToManyToMany1642423478238';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_5369db3bd33839fd3b0dd5525d1"`);
    await queryRunner.query(
      `CREATE TABLE "user_items_item" ("userId" integer NOT NULL, "itemId" integer NOT NULL, CONSTRAINT "PK_5a053edc1d018fd9992815a57f1" PRIMARY KEY ("userId", "itemId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2abc55126b5485a1ed048fba6c" ON "user_items_item" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e68a77b76d428ff26adcbf05b8" ON "user_items_item" ("itemId") `,
    );
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "user_items_item" ADD CONSTRAINT "FK_2abc55126b5485a1ed048fba6cc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_items_item" ADD CONSTRAINT "FK_e68a77b76d428ff26adcbf05b8d" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_items_item" DROP CONSTRAINT "FK_e68a77b76d428ff26adcbf05b8d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_items_item" DROP CONSTRAINT "FK_2abc55126b5485a1ed048fba6cc"`,
    );
    await queryRunner.query(`ALTER TABLE "item" ADD "userId" integer`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e68a77b76d428ff26adcbf05b8"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_2abc55126b5485a1ed048fba6c"`);
    await queryRunner.query(`DROP TABLE "user_items_item"`);
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_5369db3bd33839fd3b0dd5525d1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
