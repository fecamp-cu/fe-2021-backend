import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixAnouncementTable1649569992012 implements MigrationInterface {
  name = 'fixAnouncementTable1649569992012';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "setting" DROP CONSTRAINT "FK_da4c35df28b5b0bd630d216169e"`,
    );
    await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "projectId"`);
    await queryRunner.query(`ALTER TABLE "announcement" ADD "order" integer NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "announcement" DROP COLUMN "order"`);
    await queryRunner.query(`ALTER TABLE "setting" ADD "projectId" integer`);
    await queryRunner.query(
      `ALTER TABLE "setting" ADD CONSTRAINT "FK_da4c35df28b5b0bd630d216169e" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
