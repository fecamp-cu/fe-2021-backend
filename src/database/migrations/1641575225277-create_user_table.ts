import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUserTable1641575225277 implements MigrationInterface {
  name = 'createUserTable1641575225277';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "role" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
  }
}
