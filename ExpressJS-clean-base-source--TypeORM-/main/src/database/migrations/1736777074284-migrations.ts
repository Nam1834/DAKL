import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1736777074284 implements MigrationInterface {
    name = 'Migrations1736777074284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" ALTER COLUMN "zoom_meeting_id" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" ALTER COLUMN "zoom_meeting_id" SET NOT NULL`);
    }

}
