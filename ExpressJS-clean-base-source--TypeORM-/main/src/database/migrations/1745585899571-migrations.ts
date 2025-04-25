import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1745585899571 implements MigrationInterface {
    name = 'Migrations1745585899571'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP CONSTRAINT "FK_faea9ed46e11985c7b77af339a1"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" RENAME COLUMN "booking_request_id" TO "is_booking_request"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "is_booking_request"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "is_booking_request" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "is_booking_request"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "is_booking_request" uuid`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" RENAME COLUMN "is_booking_request" TO "booking_request_id"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD CONSTRAINT "FK_faea9ed46e11985c7b77af339a1" FOREIGN KEY ("booking_request_id") REFERENCES "booking_requests"("booking_request_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
