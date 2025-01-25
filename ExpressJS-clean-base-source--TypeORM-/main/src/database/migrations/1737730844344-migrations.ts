import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1737730844344 implements MigrationInterface {
    name = 'Migrations1737730844344'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "curriculumns" RENAME COLUMN "desciption" TO "description"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "curriculumns" RENAME COLUMN "description" TO "desciption"`);
    }

}
