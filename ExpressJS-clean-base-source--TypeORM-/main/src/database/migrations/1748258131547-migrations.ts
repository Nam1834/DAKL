import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1748258131547 implements MigrationInterface {
    name = 'Migrations1748258131547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "is_booking_request_accepted" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "is_booking_request_accepted"`);
    }

}
