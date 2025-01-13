import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1736426598193 implements MigrationInterface {
    name = 'Migrations1736426598193'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_17d1817f241f10a3dbafb169fd"`);
        await queryRunner.query(`ALTER TABLE "meetings" DROP CONSTRAINT "UQ_4ae67dcff09c72c4156de68ffcb"`);
        await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "zoom_meeting_id"`);
        await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "host_email"`);
        await queryRunner.query(`ALTER TABLE "meetings" ADD "microsoft_meeting_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meetings" ADD CONSTRAINT "UQ_0b5ffc59a2037901b1ba89e6712" UNIQUE ("microsoft_meeting_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" DROP CONSTRAINT "UQ_0b5ffc59a2037901b1ba89e6712"`);
        await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "microsoft_meeting_id"`);
        await queryRunner.query(`ALTER TABLE "meetings" ADD "host_email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meetings" ADD "zoom_meeting_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meetings" ADD CONSTRAINT "UQ_4ae67dcff09c72c4156de68ffcb" UNIQUE ("zoom_meeting_id")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_17d1817f241f10a3dbafb169fd" ON "users" ("phone_number") `);
    }

}
