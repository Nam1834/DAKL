import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1749484855225 implements MigrationInterface {
    name = 'Migrations1749484855225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "manage_bankings" ADD "description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "manage_bankings" DROP COLUMN "description"`);
    }

}
