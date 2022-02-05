import { MigrationInterface, QueryRunner } from 'typeorm';

export class editTimelineEventTable1643222335566 implements MigrationInterface {
  name = 'editTimelineEventTable1643222335566';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "timeline_event" DROP COLUMN "event_date"`);
    await queryRunner.query(
      `ALTER TABLE "timeline_event" ADD "event_start_date" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "timeline_event" ADD "event_end_date" TIMESTAMP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "timeline_event" DROP COLUMN "event_end_date"`);
    await queryRunner.query(`ALTER TABLE "timeline_event" DROP COLUMN "event_start_date"`);
    await queryRunner.query(`ALTER TABLE "timeline_event" ADD "event_date" TIMESTAMP NOT NULL`);
  }
}
