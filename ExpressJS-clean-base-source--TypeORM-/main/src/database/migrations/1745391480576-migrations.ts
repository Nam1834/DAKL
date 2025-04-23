import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1745391480576 implements MigrationInterface {
    name = 'Migrations1745391480576'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking_requests" ALTER COLUMN "hours_per_lesson" TYPE numeric(3,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking_requests" ALTER COLUMN "hours_per_lesson" TYPE numeric(3,1)`);
    }

}
