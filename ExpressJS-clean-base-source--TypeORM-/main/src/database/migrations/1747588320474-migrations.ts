import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1747588320474 implements MigrationInterface {
    name = 'Migrations1747588320474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "rating" numeric(4,2) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "number_of_rating" integer DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "number_of_rating"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "rating"`);
    }

}
