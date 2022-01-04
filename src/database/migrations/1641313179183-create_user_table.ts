import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUserTable1641313179183 implements MigrationInterface {
  name = 'createUserTable1641313179183';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "first_name"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "last_name"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tel"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "grade"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "school"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "sub_district"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "district"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "province"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "postcode"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "postcode" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ADD "province" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ADD "district" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ADD "sub_district" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ADD "address" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ADD "school" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ADD "grade" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ADD "tel" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ADD "last_name" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ADD "first_name" character varying NOT NULL`);
  }
}
