import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1743067838299 implements MigrationInterface {
    name = 'Migrations1743067838299'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "booking_requests" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "booking_request_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "tutor_id" character varying NOT NULL, "day_time_learn" json NOT NULL, "lessons_per_week" integer NOT NULL, "total_lessons" integer NOT NULL, "hours_per_lesson" numeric(3,1) NOT NULL, "start_day" date NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDING', CONSTRAINT "PK_a8f265b40f7ab4aac2b6cc821c6" PRIMARY KEY ("booking_request_id"))`);
        await queryRunner.query(`ALTER TABLE "booking_requests" ADD CONSTRAINT "FK_7a2be6885ce0291edbd1018ca80" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking_requests" ADD CONSTRAINT "FK_85ccb7106485171bf9dd9b1c60d" FOREIGN KEY ("tutor_id") REFERENCES "tutor_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking_requests" DROP CONSTRAINT "FK_85ccb7106485171bf9dd9b1c60d"`);
        await queryRunner.query(`ALTER TABLE "booking_requests" DROP CONSTRAINT "FK_7a2be6885ce0291edbd1018ca80"`);
        await queryRunner.query(`DROP TABLE "booking_requests"`);
    }

}
