import { MigrationInterface, QueryRunner } from 'typeorm';

export class addNullableToThumbnailAndFileUrlOfItemTable1650015286962
  implements MigrationInterface
{
  name = 'addNullableToThumbnailAndFileUrlOfItemTable1650015286962';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "image_url" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "file_url" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "setting" ALTER COLUMN "publish_date" SET DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "setting" ALTER COLUMN "end_date" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "setting" ALTER COLUMN "end_date" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "setting" ALTER COLUMN "publish_date" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "file_url" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "image_url" SET NOT NULL`);
  }
}
