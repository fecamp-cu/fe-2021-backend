import {MigrationInterface, QueryRunner} from "typeorm";

export class changePriceOfItemTypeToInt1648649100257 implements MigrationInterface {
    name = 'changePriceOfItemTypeToInt1648649100257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "item" ADD "price" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "item" ADD "price" smallint NOT NULL`);
    }

}
