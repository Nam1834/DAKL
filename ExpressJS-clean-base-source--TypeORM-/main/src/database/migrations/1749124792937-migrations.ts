import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1749124792937 implements MigrationInterface {
    name = 'Migrations1749124792937'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classrooms" ALTER COLUMN "classroom_evaluation" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classrooms" ALTER COLUMN "classroom_evaluation" DROP DEFAULT`);
    }

}
