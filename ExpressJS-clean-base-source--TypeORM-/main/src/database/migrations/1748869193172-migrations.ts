import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1748869193172 implements MigrationInterface {
    name = 'Migrations1748869193172'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" ADD "status" character varying NOT NULL DEFAULT 'IN_SESSION'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "status"`);
    }

}
