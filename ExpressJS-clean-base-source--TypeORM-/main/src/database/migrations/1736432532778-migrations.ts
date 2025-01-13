import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1736432532778 implements MigrationInterface {
    name = 'Migrations1736432532778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN " teaching_time"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "teaching_time" character varying`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "educational_certification"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "educational_certification" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "date_time_learn"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "date_time_learn" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "date_time_learn"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "date_time_learn" character varying`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "educational_certification"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "educational_certification" character varying`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "teaching_time"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD " teaching_time" integer`);
    }

}
