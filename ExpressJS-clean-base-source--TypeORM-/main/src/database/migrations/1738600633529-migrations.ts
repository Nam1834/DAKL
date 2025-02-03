import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1738600633529 implements MigrationInterface {
    name = 'Migrations1738600633529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_profiles" DROP CONSTRAINT "FK_b1702a9b4f1f3c2f9dfb19e5dac"`);
        await queryRunner.query(`ALTER TABLE "admins" ALTER COLUMN "admin_id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "admin_profiles" ADD CONSTRAINT "FK_b1702a9b4f1f3c2f9dfb19e5dac" FOREIGN KEY ("admin_id") REFERENCES "admins"("admin_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_profiles" DROP CONSTRAINT "FK_b1702a9b4f1f3c2f9dfb19e5dac"`);
        await queryRunner.query(`ALTER TABLE "admins" ALTER COLUMN "admin_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "admin_profiles" ADD CONSTRAINT "FK_b1702a9b4f1f3c2f9dfb19e5dac" FOREIGN KEY ("admin_id") REFERENCES "admins"("admin_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
