import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1735202227411 implements MigrationInterface {
    name = 'Migrations1735202227411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admins" DROP CONSTRAINT "FK_5733c73cd81c566a90cc4802f96"`);
        await queryRunner.query(`ALTER TABLE "admins" ALTER COLUMN "role_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "admins" ADD CONSTRAINT "FK_5733c73cd81c566a90cc4802f96" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admins" DROP CONSTRAINT "FK_5733c73cd81c566a90cc4802f96"`);
        await queryRunner.query(`ALTER TABLE "admins" ALTER COLUMN "role_id" SET DEFAULT 'ADMIN'`);
        await queryRunner.query(`ALTER TABLE "admins" ADD CONSTRAINT "FK_5733c73cd81c566a90cc4802f96" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
