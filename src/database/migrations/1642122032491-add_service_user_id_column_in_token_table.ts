import { MigrationInterface, QueryRunner } from 'typeorm';

export class addServiceUserIdColumnInTokenTable1642122032491 implements MigrationInterface {
  name = 'addServiceUserIdColumnInTokenTable1642122032491';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "token" ADD "service_user_id" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "service_user_id"`);
  }
}
