import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1736432614302 implements MigrationInterface {
    name = 'Migrations1736432614302'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "teaching_time"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "teaching_time" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "teaching_time"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "teaching_time" character varying`);
    }

}
