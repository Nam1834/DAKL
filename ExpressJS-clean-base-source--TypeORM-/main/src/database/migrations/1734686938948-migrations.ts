import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1734686938948 implements MigrationInterface {
    name = 'Migrations1734686938948'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "birthday" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "birthday" SET NOT NULL`);
    }

}
