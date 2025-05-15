import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1747288076222 implements MigrationInterface {
    name = 'Migrations1747288076222'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classroom_assessments" RENAME COLUMN "status" TO "description"`);
        await queryRunner.query(`ALTER TABLE "classroom_assessments" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "classroom_assessments" ALTER COLUMN "description" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classroom_assessments" ALTER COLUMN "description" SET DEFAULT 'IN_SESSION'`);
        await queryRunner.query(`ALTER TABLE "classroom_assessments" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "classroom_assessments" RENAME COLUMN "description" TO "status"`);
    }

}
