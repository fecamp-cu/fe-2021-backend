import { MigrationInterface, QueryRunner } from 'typeorm';

export class editContactTable1649440683613 implements MigrationInterface {
  name = 'editContactTable1649440683613';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contact" RENAME COLUMN "contact_type" TO "isLeader"`);
    await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "isLeader"`);
    await queryRunner.query(`ALTER TABLE "contact" ADD "isLeader" boolean NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "isLeader"`);
    await queryRunner.query(`ALTER TABLE "contact" ADD "isLeader" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "contact" RENAME COLUMN "isLeader" TO "contact_type"`);
  }
}
