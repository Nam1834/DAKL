import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741759391522 implements MigrationInterface {
    name = 'Migrations1741759391522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP CONSTRAINT "FK_4137f1aa966b1a0aac0887ee38e"`);
        await queryRunner.query(`ALTER TABLE "tutor_levels" DROP CONSTRAINT "PK_ad2407810807cccbc420d3794fd"`);
        await queryRunner.query(`ALTER TABLE "tutor_levels" DROP COLUMN "tutor_level_id"`);
        await queryRunner.query(`ALTER TABLE "tutor_levels" ADD "tutor_level_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tutor_levels" ADD CONSTRAINT "PK_ad2407810807cccbc420d3794fd" PRIMARY KEY ("tutor_level_id")`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "tutor_level_id"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "tutor_level_id" character varying`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD CONSTRAINT "FK_4137f1aa966b1a0aac0887ee38e" FOREIGN KEY ("tutor_level_id") REFERENCES "tutor_levels"("tutor_level_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP CONSTRAINT "FK_4137f1aa966b1a0aac0887ee38e"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "tutor_level_id"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "tutor_level_id" uuid`);
        await queryRunner.query(`ALTER TABLE "tutor_levels" DROP CONSTRAINT "PK_ad2407810807cccbc420d3794fd"`);
        await queryRunner.query(`ALTER TABLE "tutor_levels" DROP COLUMN "tutor_level_id"`);
        await queryRunner.query(`ALTER TABLE "tutor_levels" ADD "tutor_level_id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "tutor_levels" ADD CONSTRAINT "PK_ad2407810807cccbc420d3794fd" PRIMARY KEY ("tutor_level_id")`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD CONSTRAINT "FK_4137f1aa966b1a0aac0887ee38e" FOREIGN KEY ("tutor_level_id") REFERENCES "tutor_levels"("tutor_level_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
