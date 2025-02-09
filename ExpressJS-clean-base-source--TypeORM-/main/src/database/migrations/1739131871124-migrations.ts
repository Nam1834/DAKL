import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1739131871124 implements MigrationInterface {
    name = 'Migrations1739131871124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_3a22cd242f3c1fbafa7840a4aa"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3a22cd242f3c1fbafa7840a4aa" ON "admins" ("phone_number") `);
    }

}
