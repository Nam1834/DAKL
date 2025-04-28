import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1745837037319 implements MigrationInterface {
    name = 'Migrations1745837037319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "booking_request_id" uuid`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD CONSTRAINT "FK_faea9ed46e11985c7b77af339a1" FOREIGN KEY ("booking_request_id") REFERENCES "booking_requests"("booking_request_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP CONSTRAINT "FK_faea9ed46e11985c7b77af339a1"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "booking_request_id"`);
    }

}
