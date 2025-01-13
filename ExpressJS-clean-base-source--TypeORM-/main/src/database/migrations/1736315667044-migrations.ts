import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1736315667044 implements MigrationInterface {
    name = 'Migrations1736315667044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "meetings" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "meeting_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "zoom_meeting_id" character varying NOT NULL, "host_email" character varying NOT NULL, "topic" character varying, "start_time" TIMESTAMP, "duration" integer, "end_time" TIMESTAMP, "join_url" character varying, "password" character varying, CONSTRAINT "UQ_4ae67dcff09c72c4156de68ffcb" UNIQUE ("zoom_meeting_id"), CONSTRAINT "PK_94c7573e25968fa197975366cee" PRIMARY KEY ("meeting_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "meetings"`);
    }

}
