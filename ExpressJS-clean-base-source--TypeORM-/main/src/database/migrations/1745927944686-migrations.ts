import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1745927944686 implements MigrationInterface {
    name = 'Migrations1745927944686'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_requests" ADD "email_of_tutor" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_requests" DROP COLUMN "email_of_tutor"`);
    }

}
