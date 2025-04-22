import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1745300740654 implements MigrationInterface {
    name = 'Migrations1745300740654'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking_requests" RENAME COLUMN "day_time_learn" TO "date_time_learn"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking_requests" RENAME COLUMN "date_time_learn" TO "day_time_learn"`);
    }

}
