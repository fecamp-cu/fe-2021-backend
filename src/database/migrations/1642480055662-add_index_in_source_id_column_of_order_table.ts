import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIndexInSourceIdColumnOfOrderTable1642480055662 implements MigrationInterface {
  name = 'addIndexInSourceIdColumnOfOrderTable1642480055662';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_a9d051705f480a8723c7086c45" ON "order" ("source_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_a9d051705f480a8723c7086c45"`);
  }
}
