import { MigrationInterface, QueryRunner } from 'typeorm';

export class addStartDateColumnInCodeTable1649777576388 implements MigrationInterface {
  name = 'addStartDateColumnInCodeTable1649777576388';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "promotion_code" ADD "start_date" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "promotion_code" DROP COLUMN "start_date"`);
  }
}
