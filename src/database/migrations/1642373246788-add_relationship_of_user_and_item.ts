import { MigrationInterface, QueryRunner } from 'typeorm';

export class addRelationshipOfUserAndItem1642373246788 implements MigrationInterface {
  name = 'addRelationshipOfUserAndItem1642373246788';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item" ADD "userId" integer`);
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_5369db3bd33839fd3b0dd5525d1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_5369db3bd33839fd3b0dd5525d1"`);
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "userId"`);
  }
}
