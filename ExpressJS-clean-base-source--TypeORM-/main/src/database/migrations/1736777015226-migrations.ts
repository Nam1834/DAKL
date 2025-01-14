import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1736777015226 implements MigrationInterface {
    name = 'Migrations1736777015226'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" RENAME COLUMN "microsoft_meeting_id" TO "zoom_meeting_id"`);
        await queryRunner.query(`ALTER TABLE "meetings" RENAME CONSTRAINT "UQ_0b5ffc59a2037901b1ba89e6712" TO "UQ_4ae67dcff09c72c4156de68ffcb"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" RENAME CONSTRAINT "UQ_4ae67dcff09c72c4156de68ffcb" TO "UQ_0b5ffc59a2037901b1ba89e6712"`);
        await queryRunner.query(`ALTER TABLE "meetings" RENAME COLUMN "zoom_meeting_id" TO "microsoft_meeting_id"`);
    }

}
