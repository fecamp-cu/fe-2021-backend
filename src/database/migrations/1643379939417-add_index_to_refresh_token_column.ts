import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIndexToRefreshTokenColumn1643379939417 implements MigrationInterface {
  name = 'addIndexToRefreshTokenColumn1643379939417';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_b95cd28e9bf58b05f50e4ff909" ON "token" ("refresh_token") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_b95cd28e9bf58b05f50e4ff909"`);
  }
}
