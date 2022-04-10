import { MigrationInterface, QueryRunner } from 'typeorm';

export class renameAnnouncementTable1649481603248 implements MigrationInterface {
  name = 'renameAnnouncementTable1649481603248';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "announcement" DROP COLUMN "dateStart"`);
    await queryRunner.query(`ALTER TABLE "announcement" DROP COLUMN "dateEnd"`);
    await queryRunner.query(`ALTER TABLE "announcement" ADD "date_start" TIMESTAMP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "announcement" ADD "date_end" TIMESTAMP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "announcement" DROP COLUMN "date_end"`);
    await queryRunner.query(`ALTER TABLE "announcement" DROP COLUMN "date_start"`);
    await queryRunner.query(`ALTER TABLE "announcement" ADD "dateEnd" TIMESTAMP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "announcement" ADD "dateStart" TIMESTAMP NOT NULL`);
  }
}
