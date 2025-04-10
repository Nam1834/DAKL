import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1744305418438 implements MigrationInterface {
    name = 'Migrations1744305418438'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tutor_requests_gender_enum" AS ENUM('MALE', 'FEMALE')`);
        await queryRunner.query(`CREATE TABLE "tutor_requests" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "tutor_request_id" character varying NOT NULL, "user_id" character varying NOT NULL, "avatar" text, "fullname" character varying(100), "birthday" date, "gender" "public"."tutor_requests_gender_enum", "univercity" character varying, "major_id" character varying, "subject_id" character varying, "evidence_of_subject" character varying, "description_of_subject" character varying, "subject_id_2" character varying, "evidence_of_subject_2" character varying, "description_of_subject_2" character varying, "subject_id_3" character varying, "evidence_of_subject_3" character varying, "description_of_subject_3" character varying, "GPA" numeric, "evidence_of_gpa" character varying, "description" character varying, "bank_number" character varying(50), "bank_name" character varying(50), "date_time_learn" json, "teaching_time" numeric(4,2), "teaching_method" character varying DEFAULT 'ONLINE', "teaching_place" character varying, "video_url" character varying, "is_use_curriculumn" boolean NOT NULL DEFAULT false, "tutor_level_id" character varying, "type" character varying, "status" character varying NOT NULL DEFAULT 'REQUEST', CONSTRAINT "PK_c64cd999299d141306def8a0846" PRIMARY KEY ("tutor_request_id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "tutor_requests" ADD CONSTRAINT "FK_a8dc4b4b5b028ebc6f294714b69" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tutor_requests" ADD CONSTRAINT "FK_6d7f5af083d5685225c8594bc99" FOREIGN KEY ("major_id") REFERENCES "majors"("major_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tutor_requests" ADD CONSTRAINT "FK_7670903d6ed8cd82f475f40b243" FOREIGN KEY ("subject_id") REFERENCES "subjects"("subject_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tutor_requests" ADD CONSTRAINT "FK_3cbb996124ddbf3b80dabfc65b0" FOREIGN KEY ("subject_id_2") REFERENCES "subjects"("subject_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tutor_requests" ADD CONSTRAINT "FK_610ed9e40edfa3f82321dbb031a" FOREIGN KEY ("subject_id_3") REFERENCES "subjects"("subject_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tutor_requests" ADD CONSTRAINT "FK_895d10192e221ae18fc67f06f96" FOREIGN KEY ("tutor_level_id") REFERENCES "tutor_levels"("tutor_level_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_requests" DROP CONSTRAINT "FK_895d10192e221ae18fc67f06f96"`);
        await queryRunner.query(`ALTER TABLE "tutor_requests" DROP CONSTRAINT "FK_610ed9e40edfa3f82321dbb031a"`);
        await queryRunner.query(`ALTER TABLE "tutor_requests" DROP CONSTRAINT "FK_3cbb996124ddbf3b80dabfc65b0"`);
        await queryRunner.query(`ALTER TABLE "tutor_requests" DROP CONSTRAINT "FK_7670903d6ed8cd82f475f40b243"`);
        await queryRunner.query(`ALTER TABLE "tutor_requests" DROP CONSTRAINT "FK_6d7f5af083d5685225c8594bc99"`);
        await queryRunner.query(`ALTER TABLE "tutor_requests" DROP CONSTRAINT "FK_a8dc4b4b5b028ebc6f294714b69"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "status" character varying DEFAULT 'PENDING'`);
        await queryRunner.query(`DROP TABLE "tutor_requests"`);
        await queryRunner.query(`DROP TYPE "public"."tutor_requests_gender_enum"`);
    }

}
