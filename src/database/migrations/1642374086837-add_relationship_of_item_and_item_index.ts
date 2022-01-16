import { MigrationInterface, QueryRunner } from 'typeorm';

export class addRelationshipOfItemAndItemIndex1642374086837 implements MigrationInterface {
  name = 'addRelationshipOfItemAndItemIndex1642374086837';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item_index" ADD "itemId" integer`);
    await queryRunner.query(
      `ALTER TABLE "item_index" ADD CONSTRAINT "FK_0a3a6e63baf939a58d5f3ac6df9" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item_index" DROP CONSTRAINT "FK_0a3a6e63baf939a58d5f3ac6df9"`,
    );
    await queryRunner.query(`ALTER TABLE "item_index" DROP COLUMN "itemId"`);
  }
}
