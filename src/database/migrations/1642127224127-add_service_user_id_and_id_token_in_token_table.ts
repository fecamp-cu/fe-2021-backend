import { MigrationInterface, QueryRunner } from 'typeorm';

export class addServiceUserIdAndIdTokenInTokenTable1642127224127 implements MigrationInterface {
  name = 'addServiceUserIdAndIdTokenInTokenTable1642127224127';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "token" ADD "service_user_id" character varying`);
    await queryRunner.query(`ALTER TABLE "token" ADD "id_token" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "id_token"`);
    await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "service_user_id"`);
  }
}
