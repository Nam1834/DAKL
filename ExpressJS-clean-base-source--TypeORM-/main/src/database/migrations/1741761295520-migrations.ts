import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741761295520 implements MigrationInterface {
    name = 'Migrations1741761295520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP CONSTRAINT "FK_baffb4d7d099e3c1c74d3dfd17c"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "subject_id"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "subject_id" character varying`);
        await queryRunner.query(`ALTER TABLE "tutor_subjects" DROP CONSTRAINT "FK_3f5eae36ca769b75f2df0e602af"`);
        await queryRunner.query(`ALTER TABLE "tutor_subjects" DROP COLUMN "subject_id"`);
        await queryRunner.query(`ALTER TABLE "tutor_subjects" ADD "subject_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subjects" DROP CONSTRAINT "PK_3573ed298f466a8ba663579e077"`);
        await queryRunner.query(`ALTER TABLE "subjects" DROP COLUMN "subject_id"`);
        await queryRunner.query(`ALTER TABLE "subjects" ADD "subject_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subjects" ADD CONSTRAINT "PK_3573ed298f466a8ba663579e077" PRIMARY KEY ("subject_id")`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD CONSTRAINT "FK_baffb4d7d099e3c1c74d3dfd17c" FOREIGN KEY ("subject_id") REFERENCES "subjects"("subject_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tutor_subjects" ADD CONSTRAINT "FK_3f5eae36ca769b75f2df0e602af" FOREIGN KEY ("subject_id") REFERENCES "subjects"("subject_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_subjects" DROP CONSTRAINT "FK_3f5eae36ca769b75f2df0e602af"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP CONSTRAINT "FK_baffb4d7d099e3c1c74d3dfd17c"`);
        await queryRunner.query(`ALTER TABLE "subjects" DROP CONSTRAINT "PK_3573ed298f466a8ba663579e077"`);
        await queryRunner.query(`ALTER TABLE "subjects" DROP COLUMN "subject_id"`);
        await queryRunner.query(`ALTER TABLE "subjects" ADD "subject_id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "subjects" ADD CONSTRAINT "PK_3573ed298f466a8ba663579e077" PRIMARY KEY ("subject_id")`);
        await queryRunner.query(`ALTER TABLE "tutor_subjects" DROP COLUMN "subject_id"`);
        await queryRunner.query(`ALTER TABLE "tutor_subjects" ADD "subject_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tutor_subjects" ADD CONSTRAINT "FK_3f5eae36ca769b75f2df0e602af" FOREIGN KEY ("subject_id") REFERENCES "subjects"("subject_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "subject_id"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "subject_id" uuid`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD CONSTRAINT "FK_baffb4d7d099e3c1c74d3dfd17c" FOREIGN KEY ("subject_id") REFERENCES "subjects"("subject_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
