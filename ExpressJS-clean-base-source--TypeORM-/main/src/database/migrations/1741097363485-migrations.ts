import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741097363485 implements MigrationInterface {
    name = 'Migrations1741097363485'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "majors" ADD "sum_name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "majors" DROP COLUMN "sum_name"`);
    }

}
