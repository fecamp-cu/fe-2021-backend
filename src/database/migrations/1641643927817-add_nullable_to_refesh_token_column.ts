import { MigrationInterface, QueryRunner } from 'typeorm';

export class addNullableToRefeshTokenColumn1641643927817 implements MigrationInterface {
  name = 'addNullableToRefeshTokenColumn1641643927817';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "token" ALTER COLUMN "refresh_token" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "token" ALTER COLUMN "refresh_token" SET NOT NULL`);
  }
}
