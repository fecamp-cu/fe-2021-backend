import { MigrationInterface, QueryRunner } from 'typeorm';

export class addRelationshipOfUserAndValidateCode1642335231947 implements MigrationInterface {
  name = 'addRelationshipOfUserAndValidateCode1642335231947';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "validate_code" ADD "userId" integer`);
    await queryRunner.query(
      `ALTER TABLE "validate_code" ADD CONSTRAINT "FK_8e34e8976ba08ae823c92a1bd73" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "validate_code" DROP CONSTRAINT "FK_8e34e8976ba08ae823c92a1bd73"`,
    );
    await queryRunner.query(`ALTER TABLE "validate_code" DROP COLUMN "userId"`);
  }
}
