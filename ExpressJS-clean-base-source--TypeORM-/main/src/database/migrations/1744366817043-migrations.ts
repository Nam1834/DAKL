import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1744366817043 implements MigrationInterface {
    name = 'Migrations1744366817043'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_requests" ADD "total_test_points" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_requests" DROP COLUMN "total_test_points"`);
    }

}
