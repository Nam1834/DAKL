import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741180921812 implements MigrationInterface {
    name = 'Migrations1741180921812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP CONSTRAINT "FK_93dbe859731c07c5da9be24301e"`);
        await queryRunner.query(`ALTER TABLE "tutor_levels" DROP CONSTRAINT "PK_ad2407810807cccbc420d3794fd"`);
        await queryRunner.query(`ALTER TABLE "tutor_levels" DROP COLUMN "tutor_level_id"`);
        await queryRunner.query(`ALTER TABLE "tutor_levels" ADD "tutor_level_id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "tutor_levels" ADD CONSTRAINT "PK_ad2407810807cccbc420d3794fd" PRIMARY KEY ("tutor_level_id")`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "tutorLevelTutorLevelId"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "tutorLevelTutorLevelId" uuid`);
        await queryRunner.query(`ALTER TABLE "subjects" DROP CONSTRAINT "PK_3573ed298f466a8ba663579e077"`);
        await queryRunner.query(`ALTER TABLE "subjects" DROP COLUMN "subject_id"`);
        await queryRunner.query(`ALTER TABLE "subjects" ADD "subject_id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "subjects" ADD CONSTRAINT "PK_3573ed298f466a8ba663579e077" PRIMARY KEY ("subject_id")`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD CONSTRAINT "FK_93dbe859731c07c5da9be24301e" FOREIGN KEY ("tutorLevelTutorLevelId") REFERENCES "tutor_levels"("tutor_level_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP CONSTRAINT "FK_93dbe859731c07c5da9be24301e"`);
        await queryRunner.query(`ALTER TABLE "subjects" DROP CONSTRAINT "PK_3573ed298f466a8ba663579e077"`);
        await queryRunner.query(`ALTER TABLE "subjects" DROP COLUMN "subject_id"`);
        await queryRunner.query(`ALTER TABLE "subjects" ADD "subject_id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subjects" ADD CONSTRAINT "PK_3573ed298f466a8ba663579e077" PRIMARY KEY ("subject_id")`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "tutorLevelTutorLevelId"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "tutorLevelTutorLevelId" integer`);
        await queryRunner.query(`ALTER TABLE "tutor_levels" DROP CONSTRAINT "PK_ad2407810807cccbc420d3794fd"`);
        await queryRunner.query(`ALTER TABLE "tutor_levels" DROP COLUMN "tutor_level_id"`);
        await queryRunner.query(`ALTER TABLE "tutor_levels" ADD "tutor_level_id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tutor_levels" ADD CONSTRAINT "PK_ad2407810807cccbc420d3794fd" PRIMARY KEY ("tutor_level_id")`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD CONSTRAINT "FK_93dbe859731c07c5da9be24301e" FOREIGN KEY ("tutorLevelTutorLevelId") REFERENCES "tutor_levels"("tutor_level_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
