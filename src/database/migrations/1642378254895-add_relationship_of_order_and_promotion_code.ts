import { MigrationInterface, QueryRunner } from 'typeorm';

export class addRelationshipOfOrderAndPromotionCode1642378254895 implements MigrationInterface {
  name = 'addRelationshipOfOrderAndPromotionCode1642378254895';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" ADD "codeId" integer`);
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "UQ_8d7e394887bee664e895c297cd4" UNIQUE ("codeId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_8d7e394887bee664e895c297cd4" FOREIGN KEY ("codeId") REFERENCES "promotion_code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_8d7e394887bee664e895c297cd4"`);
    await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "UQ_8d7e394887bee664e895c297cd4"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "codeId"`);
  }
}
