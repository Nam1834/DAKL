import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741417866872 implements MigrationInterface {
    name = 'Migrations1741417866872'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "teaching_method"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "work_address"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "major_name"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "teaching_certification"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "degree"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN " teaching_road_map"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "fullname" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "major_id" character varying`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "birthday" date`);
        await queryRunner.query(`CREATE TYPE "public"."tutor_profiles_gender_enum" AS ENUM('MALE', 'FEMALE')`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "gender" "public"."tutor_profiles_gender_enum"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "bank_number" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "bank_name" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "subject_id" uuid`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "gpa_or_name_degree" character varying`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "description_of_subject" character varying`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "is_public_profile" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD CONSTRAINT "FK_8dc6a520755a827bb03d0d74981" FOREIGN KEY ("major_id") REFERENCES "majors"("major_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD CONSTRAINT "FK_baffb4d7d099e3c1c74d3dfd17c" FOREIGN KEY ("subject_id") REFERENCES "subjects"("subject_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP CONSTRAINT "FK_baffb4d7d099e3c1c74d3dfd17c"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP CONSTRAINT "FK_8dc6a520755a827bb03d0d74981"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "is_public_profile"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "description_of_subject"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "gpa_or_name_degree"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "subject_id"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "bank_name"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "bank_number"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "gender"`);
        await queryRunner.query(`DROP TYPE "public"."tutor_profiles_gender_enum"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "birthday"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "major_id"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "fullname"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD " teaching_road_map" character varying`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "degree" character varying`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "teaching_certification" character varying`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "major_name" character varying`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "work_address" character varying`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "teaching_method" character varying`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "amount" integer`);
    }

}
