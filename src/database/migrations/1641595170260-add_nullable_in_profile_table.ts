import { MigrationInterface, QueryRunner } from 'typeorm';

export class addNullableInProfileTable1641595170260 implements MigrationInterface {
  name = 'addNullableInProfileTable1641595170260';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "tel" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "grade" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "school" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "address" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "sub_district" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "district" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "province" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "postcode" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "postcode" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "province" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "district" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "sub_district" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "address" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "school" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "grade" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "tel" SET NOT NULL`);
  }
}
