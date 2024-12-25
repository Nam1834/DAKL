import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1734514284201 implements MigrationInterface {
    name = 'Migrations1734514284201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "user_display_name" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "user_display_name" SET NOT NULL`);
    }

}
