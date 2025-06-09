import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1749477465446 implements MigrationInterface {
    name = 'Migrations1749477465446'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "manage_bankings" ADD "status" character varying NOT NULL DEFAULT 'REQUEST'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "manage_bankings" DROP COLUMN "status"`);
    }

}
