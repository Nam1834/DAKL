import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1736444446123 implements MigrationInterface {
    name = 'Migrations1736444446123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "home_address" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "gender" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "gender" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "gender" SET DEFAULT 'MALE'`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "gender" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "home_address" SET NOT NULL`);
    }

}
