import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeIndexColumnToChargeIdInOrderTable1643056954653 implements MigrationInterface {
  name = 'changeIndexColumnToChargeIdInOrderTable1643056954653';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_a9d051705f480a8723c7086c45"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_adf4e5ae715c2d429b9d1bc06b" ON "order" ("charge_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_adf4e5ae715c2d429b9d1bc06b"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_a9d051705f480a8723c7086c45" ON "order" ("source_id") `,
    );
  }
}
