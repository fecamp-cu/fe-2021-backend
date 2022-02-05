import { MigrationInterface, QueryRunner } from 'typeorm';

export class createCustomerTable1642545017962 implements MigrationInterface {
  name = 'createCustomerTable1642545017962';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_667be244882bfba8df068f601b"`);
    await queryRunner.query(
      `CREATE TABLE "customer" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "tel" character varying, "grade" character varying, "school" character varying, "address" character varying, "sub_district" character varying, "district" character varying, "province" character varying, "postcode" character varying, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fdb2f3ad8115da4c7718109a6e" ON "customer" ("email") `,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customer_email"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "order" ADD "customerId" integer`);
    await queryRunner.query(`ALTER TABLE "user" ADD "customerId" integer`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_6c687a8fa35b0ae35ce766b56ce" UNIQUE ("customerId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_124456e637cca7a415897dce659" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_6c687a8fa35b0ae35ce766b56ce" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_6c687a8fa35b0ae35ce766b56ce"`);
    await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_124456e637cca7a415897dce659"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_6c687a8fa35b0ae35ce766b56ce"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "customerId"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customerId"`);
    await queryRunner.query(`ALTER TABLE "order" ADD "userId" integer`);
    await queryRunner.query(`ALTER TABLE "order" ADD "customer_email" character varying NOT NULL`);
    await queryRunner.query(`DROP INDEX "public"."IDX_fdb2f3ad8115da4c7718109a6e"`);
    await queryRunner.query(`DROP TABLE "customer"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_667be244882bfba8df068f601b" ON "order" ("customer_email") `,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
