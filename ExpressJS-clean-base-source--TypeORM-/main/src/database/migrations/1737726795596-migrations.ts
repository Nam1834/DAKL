import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1737726795596 implements MigrationInterface {
    name = 'Migrations1737726795596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "teaching_method" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "teaching_method"`);
    }

}
