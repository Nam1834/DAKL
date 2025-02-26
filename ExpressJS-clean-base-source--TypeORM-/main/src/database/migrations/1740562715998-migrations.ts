import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1740562715998 implements MigrationInterface {
    name = 'Migrations1740562715998'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "checkActive" character varying DEFAULT 'ACTIVE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "checkActive"`);
    }

}
