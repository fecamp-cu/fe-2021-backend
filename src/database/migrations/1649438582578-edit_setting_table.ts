import {MigrationInterface, QueryRunner} from "typeorm";

export class editSettingTable1649438582578 implements MigrationInterface {
    name = 'editSettingTable1649438582578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_3149e1b9d773f4e66f11a255556"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "UQ_3149e1b9d773f4e66f11a255556"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "settingId"`);
        await queryRunner.query(`ALTER TABLE "setting" ADD "projectId" integer`);
        await queryRunner.query(`ALTER TABLE "setting" ADD CONSTRAINT "UQ_da4c35df28b5b0bd630d216169e" UNIQUE ("projectId")`);
        await queryRunner.query(`ALTER TABLE "setting" ADD CONSTRAINT "FK_da4c35df28b5b0bd630d216169e" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "setting" DROP CONSTRAINT "FK_da4c35df28b5b0bd630d216169e"`);
        await queryRunner.query(`ALTER TABLE "setting" DROP CONSTRAINT "UQ_da4c35df28b5b0bd630d216169e"`);
        await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "projectId"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "settingId" integer`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "UQ_3149e1b9d773f4e66f11a255556" UNIQUE ("settingId")`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_3149e1b9d773f4e66f11a255556" FOREIGN KEY ("settingId") REFERENCES "setting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
