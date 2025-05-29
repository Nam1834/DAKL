import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1748551229241 implements MigrationInterface {
    name = 'Migrations1748551229241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" ADD "user_join_time" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "meetings" ADD "user_left_time" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "user_left_time"`);
        await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "user_join_time"`);
    }

}
