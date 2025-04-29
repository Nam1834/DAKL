import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1745924258969 implements MigrationInterface {
    name = 'Migrations1745924258969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "is_my_favourite_tutor" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "is_my_favourite_tutor"`);
    }

}
