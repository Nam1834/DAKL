import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1746063177889 implements MigrationInterface {
    name = 'Migrations1746063177889'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking_requests" ADD "is_hire" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking_requests" DROP COLUMN "is_hire"`);
    }

}
