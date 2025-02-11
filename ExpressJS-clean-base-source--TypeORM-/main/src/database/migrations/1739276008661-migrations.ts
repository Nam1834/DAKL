import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1739276008661 implements MigrationInterface {
    name = 'Migrations1739276008661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "work_address" character varying`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "is_use_curriculumn" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "is_use_curriculumn"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "work_address"`);
    }

}
