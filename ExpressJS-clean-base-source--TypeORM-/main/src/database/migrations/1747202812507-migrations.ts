import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1747202812507 implements MigrationInterface {
    name = 'Migrations1747202812507'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "is_use_curriculumn"`);
        await queryRunner.query(`ALTER TABLE "tutor_requests" DROP COLUMN "is_use_curriculumn"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_requests" ADD "is_use_curriculumn" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "is_use_curriculumn" boolean NOT NULL DEFAULT false`);
    }

}
