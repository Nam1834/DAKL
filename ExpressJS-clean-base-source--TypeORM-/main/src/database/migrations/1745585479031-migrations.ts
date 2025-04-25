import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1745585479031 implements MigrationInterface {
    name = 'Migrations1745585479031'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking_requests" ADD CONSTRAINT "FK_85ccb7106485171bf9dd9b1c60d" FOREIGN KEY ("tutor_id") REFERENCES "tutor_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking_requests" DROP CONSTRAINT "FK_85ccb7106485171bf9dd9b1c60d"`);
    }

}
