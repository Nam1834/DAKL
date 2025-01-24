import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1737726548272 implements MigrationInterface {
    name = 'Migrations1737726548272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "curriculumns" ALTER COLUMN "status" SET DEFAULT 'UNACTIVE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "curriculumns" ALTER COLUMN "status" DROP DEFAULT`);
    }

}
