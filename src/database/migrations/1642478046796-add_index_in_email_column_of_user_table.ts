import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIndexInEmailColumnOfUserTable1642478046796 implements MigrationInterface {
  name = 'addIndexInEmailColumnOfUserTable1642478046796';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
  }
}
