import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTokenTable1641586322810 implements MigrationInterface {
  name = 'createTokenTable1641586322810';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "token" ("id" SERIAL NOT NULL, "service_type" character varying NOT NULL, "access_token" character varying NOT NULL, "refresh_token" character varying NOT NULL, "expires_date" TIMESTAMP NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "token"`);
  }
}
