import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixRelationSettingProject1649443433965 implements MigrationInterface {
  name = 'fixRelationSettingProject1649443433965';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "setting" DROP CONSTRAINT "FK_da4c35df28b5b0bd630d216169e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "setting" DROP CONSTRAINT "UQ_da4c35df28b5b0bd630d216169e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "setting" ADD CONSTRAINT "FK_da4c35df28b5b0bd630d216169e" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "setting" DROP CONSTRAINT "FK_da4c35df28b5b0bd630d216169e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "setting" ADD CONSTRAINT "UQ_da4c35df28b5b0bd630d216169e" UNIQUE ("projectId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "setting" ADD CONSTRAINT "FK_da4c35df28b5b0bd630d216169e" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
