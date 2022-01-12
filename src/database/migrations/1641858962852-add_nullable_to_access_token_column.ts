import { MigrationInterface, QueryRunner } from 'typeorm';

export class addNullableToAccessTokenColumn1641858962852 implements MigrationInterface {
  name = 'addNullableToAccessTokenColumn1641858962852';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "token" ALTER COLUMN "access_token" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "token" ALTER COLUMN "access_token" SET NOT NULL`);
  }
}
