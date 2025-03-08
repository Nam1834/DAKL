import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741380448546 implements MigrationInterface {
    name = 'Migrations1741380448546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD "major_id" character varying`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_71954d77e50f1d3aeecbe6d305f" FOREIGN KEY ("major_id") REFERENCES "majors"("major_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_71954d77e50f1d3aeecbe6d305f"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP COLUMN "major_id"`);
    }

}
