import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741761112307 implements MigrationInterface {
    name = 'Migrations1741761112307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP CONSTRAINT "FK_8dc6a520755a827bb03d0d74981"`);
        await queryRunner.query(`ALTER TABLE "tutor_subjects" DROP CONSTRAINT "FK_664d16e6090d860740f7142a106"`);
        await queryRunner.query(`ALTER TABLE "tutor_subjects" DROP CONSTRAINT "FK_3f5eae36ca769b75f2df0e602af"`);
        await queryRunner.query(`ALTER TABLE "subjects" DROP CONSTRAINT "FK_aaf41354eadcf6dc08e5795fcb8"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_71954d77e50f1d3aeecbe6d305f"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD CONSTRAINT "FK_8dc6a520755a827bb03d0d74981" FOREIGN KEY ("major_id") REFERENCES "majors"("major_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tutor_subjects" ADD CONSTRAINT "FK_664d16e6090d860740f7142a106" FOREIGN KEY ("tutor_id") REFERENCES "tutor_profiles"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tutor_subjects" ADD CONSTRAINT "FK_3f5eae36ca769b75f2df0e602af" FOREIGN KEY ("subject_id") REFERENCES "subjects"("subject_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subjects" ADD CONSTRAINT "FK_aaf41354eadcf6dc08e5795fcb8" FOREIGN KEY ("major_id") REFERENCES "majors"("major_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_71954d77e50f1d3aeecbe6d305f" FOREIGN KEY ("major_id") REFERENCES "majors"("major_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_71954d77e50f1d3aeecbe6d305f"`);
        await queryRunner.query(`ALTER TABLE "subjects" DROP CONSTRAINT "FK_aaf41354eadcf6dc08e5795fcb8"`);
        await queryRunner.query(`ALTER TABLE "tutor_subjects" DROP CONSTRAINT "FK_3f5eae36ca769b75f2df0e602af"`);
        await queryRunner.query(`ALTER TABLE "tutor_subjects" DROP CONSTRAINT "FK_664d16e6090d860740f7142a106"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP CONSTRAINT "FK_8dc6a520755a827bb03d0d74981"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_71954d77e50f1d3aeecbe6d305f" FOREIGN KEY ("major_id") REFERENCES "majors"("major_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subjects" ADD CONSTRAINT "FK_aaf41354eadcf6dc08e5795fcb8" FOREIGN KEY ("major_id") REFERENCES "majors"("major_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tutor_subjects" ADD CONSTRAINT "FK_3f5eae36ca769b75f2df0e602af" FOREIGN KEY ("subject_id") REFERENCES "subjects"("subject_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tutor_subjects" ADD CONSTRAINT "FK_664d16e6090d860740f7142a106" FOREIGN KEY ("tutor_id") REFERENCES "tutor_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD CONSTRAINT "FK_8dc6a520755a827bb03d0d74981" FOREIGN KEY ("major_id") REFERENCES "majors"("major_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
