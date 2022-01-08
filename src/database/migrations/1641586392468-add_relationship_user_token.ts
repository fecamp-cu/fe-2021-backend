import { MigrationInterface, QueryRunner } from 'typeorm';

export class addRelationshipUserToken1641586392468 implements MigrationInterface {
  name = 'addRelationshipUserToken1641586392468';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "token" ADD "userId" integer`);
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "FK_94f168faad896c0786646fa3d4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_94f168faad896c0786646fa3d4a"`);
    await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "userId"`);
  }
}
