import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1737641947692 implements MigrationInterface {
    name = 'Migrations1737641947692'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "coin" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "coin"`);
    }

}
