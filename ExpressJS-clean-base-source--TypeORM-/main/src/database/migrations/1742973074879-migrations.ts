import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1742973074879 implements MigrationInterface {
    name = 'Migrations1742973074879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "coin_per_hours" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "coin_per_hours"`);
    }

}
