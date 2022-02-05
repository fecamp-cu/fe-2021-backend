import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIsEmailVerifiedColumnInUserTable1642331107573 implements MigrationInterface {
  name = 'addIsEmailVerifiedColumnInUserTable1642331107573';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "is_email_verified" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_email_verified"`);
  }
}
