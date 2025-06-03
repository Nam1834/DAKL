import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1748939974185 implements MigrationInterface {
    name = 'Migrations1748939974185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classrooms" ADD "is_meeted" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classrooms" DROP COLUMN "is_meeted"`);
    }

}
