import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741759549264 implements MigrationInterface {
    name = 'Migrations1741759549264'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP CONSTRAINT "FK_baffb4d7d099e3c1c74d3dfd17c"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP CONSTRAINT "FK_4137f1aa966b1a0aac0887ee38e"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD CONSTRAINT "FK_baffb4d7d099e3c1c74d3dfd17c" FOREIGN KEY ("subject_id") REFERENCES "subjects"("subject_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD CONSTRAINT "FK_4137f1aa966b1a0aac0887ee38e" FOREIGN KEY ("tutor_level_id") REFERENCES "tutor_levels"("tutor_level_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP CONSTRAINT "FK_4137f1aa966b1a0aac0887ee38e"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP CONSTRAINT "FK_baffb4d7d099e3c1c74d3dfd17c"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD CONSTRAINT "FK_4137f1aa966b1a0aac0887ee38e" FOREIGN KEY ("tutor_level_id") REFERENCES "tutor_levels"("tutor_level_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD CONSTRAINT "FK_baffb4d7d099e3c1c74d3dfd17c" FOREIGN KEY ("subject_id") REFERENCES "subjects"("subject_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
