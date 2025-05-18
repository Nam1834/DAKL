import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1747588400575 implements MigrationInterface {
    name = 'Migrations1747588400575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ALTER COLUMN "rating" TYPE numeric(2,1)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ALTER COLUMN "rating" TYPE numeric(4,2)`);
    }

}
