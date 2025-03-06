import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741189528859 implements MigrationInterface {
    name = 'Migrations1741189528859'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tutor_subjects" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "tutor_subject_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tutor_id" uuid NOT NULL, "subject_id" uuid NOT NULL, CONSTRAINT "PK_9a3cfac3f42c812501f038e3f90" PRIMARY KEY ("tutor_subject_id"))`);
        await queryRunner.query(`ALTER TABLE "tutor_subjects" ADD CONSTRAINT "FK_664d16e6090d860740f7142a106" FOREIGN KEY ("tutor_id") REFERENCES "tutor_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tutor_subjects" ADD CONSTRAINT "FK_3f5eae36ca769b75f2df0e602af" FOREIGN KEY ("subject_id") REFERENCES "subjects"("subject_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_subjects" DROP CONSTRAINT "FK_3f5eae36ca769b75f2df0e602af"`);
        await queryRunner.query(`ALTER TABLE "tutor_subjects" DROP CONSTRAINT "FK_664d16e6090d860740f7142a106"`);
        await queryRunner.query(`DROP TABLE "tutor_subjects"`);
    }

}
