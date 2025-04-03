import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1743616141307 implements MigrationInterface {
    name = 'Migrations1743616141307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "gpa_or_name_degree"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "evidence_of_subject" character varying`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "subject_id_2" character varying`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "evidence_of_subject_2" character varying`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "description_of_subject_2" character varying`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "subject_id_3" character varying`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "evidence_of_subject_3" character varying`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "description_of_subject_3" character varying`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "evidence_of_gpa" character varying`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "teaching_method" character varying DEFAULT 'ONLINE'`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "teaching_place" character varying`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD CONSTRAINT "FK_e7b360bc2a8ded5e6a9a6748cff" FOREIGN KEY ("subject_id_2") REFERENCES "subjects"("subject_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD CONSTRAINT "FK_d808fb9d483edf3907786c7848f" FOREIGN KEY ("subject_id_3") REFERENCES "subjects"("subject_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP CONSTRAINT "FK_d808fb9d483edf3907786c7848f"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP CONSTRAINT "FK_e7b360bc2a8ded5e6a9a6748cff"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "teaching_place"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "teaching_method"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "evidence_of_gpa"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "description_of_subject_3"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "evidence_of_subject_3"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "subject_id_3"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "description_of_subject_2"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "evidence_of_subject_2"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "subject_id_2"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "evidence_of_subject"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "gpa_or_name_degree" character varying`);
    }

}
