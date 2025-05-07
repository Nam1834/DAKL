import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1746596213162 implements MigrationInterface {
    name = 'Migrations1746596213162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classrooms" ADD "name_of_room" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classrooms" DROP COLUMN "name_of_room"`);
    }

}
