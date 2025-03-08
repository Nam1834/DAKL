import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741380737146 implements MigrationInterface {
    name = 'Migrations1741380737146'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP CONSTRAINT "FK_93dbe859731c07c5da9be24301e"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" RENAME COLUMN "tutorLevelTutorLevelId" TO "tutor_level_id"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD CONSTRAINT "FK_4137f1aa966b1a0aac0887ee38e" FOREIGN KEY ("tutor_level_id") REFERENCES "tutor_levels"("tutor_level_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP CONSTRAINT "FK_4137f1aa966b1a0aac0887ee38e"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" RENAME COLUMN "tutor_level_id" TO "tutorLevelTutorLevelId"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD CONSTRAINT "FK_93dbe859731c07c5da9be24301e" FOREIGN KEY ("tutorLevelTutorLevelId") REFERENCES "tutor_levels"("tutor_level_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
