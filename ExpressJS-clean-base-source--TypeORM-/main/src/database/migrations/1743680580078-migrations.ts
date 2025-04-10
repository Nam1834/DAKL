import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1743680580078 implements MigrationInterface {
    name = 'Migrations1743680580078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "educational_certification"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "teaching_time"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "teaching_time" numeric(4,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "teaching_time"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "teaching_time" integer`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "educational_certification" character varying(255)`);
    }

}
