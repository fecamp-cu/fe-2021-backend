import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIsReuseableToPromotionCodeTable1642838856035 implements MigrationInterface {
  name = 'addIsReuseableToPromotionCodeTable1642838856035';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "promotion_code" ADD "is_reuseable" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "promotion_code" DROP COLUMN "is_reuseable"`);
  }
}
