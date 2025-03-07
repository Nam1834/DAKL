import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741324622599 implements MigrationInterface {
    name = 'Migrations1741324622599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" RENAME COLUMN "title" TO "tittle"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" RENAME COLUMN "tittle" TO "title"`);
    }

}
