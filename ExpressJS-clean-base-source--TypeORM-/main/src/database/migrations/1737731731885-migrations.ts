import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1737731731885 implements MigrationInterface {
    name = 'Migrations1737731731885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "my_curriculumn_items" ADD "create_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "my_curriculumn_items" ADD "update_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "my_curriculumn_items" ADD "create_by" character varying`);
        await queryRunner.query(`ALTER TABLE "my_curriculumn_items" ADD "update_by" character varying`);
        await queryRunner.query(`ALTER TABLE "my_curriculumn_items" ADD "delete_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "my_curriculumns" ADD "create_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "my_curriculumns" ADD "update_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "my_curriculumns" ADD "create_by" character varying`);
        await queryRunner.query(`ALTER TABLE "my_curriculumns" ADD "update_by" character varying`);
        await queryRunner.query(`ALTER TABLE "my_curriculumns" ADD "delete_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "my_curriculumns" DROP COLUMN "delete_at"`);
        await queryRunner.query(`ALTER TABLE "my_curriculumns" DROP COLUMN "update_by"`);
        await queryRunner.query(`ALTER TABLE "my_curriculumns" DROP COLUMN "create_by"`);
        await queryRunner.query(`ALTER TABLE "my_curriculumns" DROP COLUMN "update_at"`);
        await queryRunner.query(`ALTER TABLE "my_curriculumns" DROP COLUMN "create_at"`);
        await queryRunner.query(`ALTER TABLE "my_curriculumn_items" DROP COLUMN "delete_at"`);
        await queryRunner.query(`ALTER TABLE "my_curriculumn_items" DROP COLUMN "update_by"`);
        await queryRunner.query(`ALTER TABLE "my_curriculumn_items" DROP COLUMN "create_by"`);
        await queryRunner.query(`ALTER TABLE "my_curriculumn_items" DROP COLUMN "update_at"`);
        await queryRunner.query(`ALTER TABLE "my_curriculumn_items" DROP COLUMN "create_at"`);
    }

}
