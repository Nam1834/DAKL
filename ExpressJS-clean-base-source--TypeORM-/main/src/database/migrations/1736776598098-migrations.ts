import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1736776598098 implements MigrationInterface {
    name = 'Migrations1736776598098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" ADD "hostEmail" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "start_time"`);
        await queryRunner.query(`ALTER TABLE "meetings" ADD "start_time" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "start_time"`);
        await queryRunner.query(`ALTER TABLE "meetings" ADD "start_time" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "hostEmail"`);
    }

}
