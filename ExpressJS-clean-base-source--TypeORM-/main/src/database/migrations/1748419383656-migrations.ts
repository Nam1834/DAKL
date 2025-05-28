import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1748419383656 implements MigrationInterface {
    name = 'Migrations1748419383656'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "end_time"`);
        await queryRunner.query(`ALTER TABLE "meetings" ADD "end_time" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "end_time"`);
        await queryRunner.query(`ALTER TABLE "meetings" ADD "end_time" TIMESTAMP`);
    }

}
