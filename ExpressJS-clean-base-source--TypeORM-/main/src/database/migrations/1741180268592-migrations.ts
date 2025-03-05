import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741180268592 implements MigrationInterface {
    name = 'Migrations1741180268592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tutor_levels" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "tutor_level_id" SERIAL NOT NULL, "level_name" character varying NOT NULL, "salary" integer NOT NULL, "description" text NOT NULL, CONSTRAINT "PK_ad2407810807cccbc420d3794fd" PRIMARY KEY ("tutor_level_id"))`);
        await queryRunner.query(`CREATE TABLE "subjects" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "subject_id" SERIAL NOT NULL, "subject_name" character varying NOT NULL, "major_name" character varying NOT NULL, "majorMajorId" character varying, CONSTRAINT "PK_3573ed298f466a8ba663579e077" PRIMARY KEY ("subject_id"))`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "tutorLevelTutorLevelId" integer`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD CONSTRAINT "FK_93dbe859731c07c5da9be24301e" FOREIGN KEY ("tutorLevelTutorLevelId") REFERENCES "tutor_levels"("tutor_level_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subjects" ADD CONSTRAINT "FK_c7fab727d3110f37eb6b88508de" FOREIGN KEY ("majorMajorId") REFERENCES "majors"("major_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subjects" DROP CONSTRAINT "FK_c7fab727d3110f37eb6b88508de"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP CONSTRAINT "FK_93dbe859731c07c5da9be24301e"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "tutorLevelTutorLevelId"`);
        await queryRunner.query(`DROP TABLE "subjects"`);
        await queryRunner.query(`DROP TABLE "tutor_levels"`);
    }

}
