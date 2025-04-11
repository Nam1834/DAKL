import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1744362760433 implements MigrationInterface {
    name = 'Migrations1744362760433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_requests" ALTER COLUMN "teaching_method" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tutor_requests" ALTER COLUMN "is_use_curriculumn" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_requests" ALTER COLUMN "is_use_curriculumn" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "tutor_requests" ALTER COLUMN "teaching_method" SET DEFAULT 'ONLINE'`);
    }

}
