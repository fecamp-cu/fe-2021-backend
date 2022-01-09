import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUserTableRole1641652534490 implements MigrationInterface {
  name = 'createUserTableRole1641652534490';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "role" character varying NOT NULL DEFAULT 'user'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
  }
}
