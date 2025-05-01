import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1746063893922 implements MigrationInterface {
    name = 'Migrations1746063893922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "classrooms" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "classroom_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "tutor_id" character varying NOT NULL, "date_time_learn" json NOT NULL, "start_day" date NOT NULL, "end_day" date NOT NULL, "classroom_evaluation" numeric(2,1), "status" character varying NOT NULL DEFAULT 'IN_SESSION', CONSTRAINT "PK_1e0df9c0a06790ce2816fa97695" PRIMARY KEY ("classroom_id"))`);
        await queryRunner.query(`ALTER TABLE "classrooms" ADD CONSTRAINT "FK_93ac11d9e0692fd8e5c242e5795" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classrooms" ADD CONSTRAINT "FK_1867943b22d7ab4762225e77130" FOREIGN KEY ("tutor_id") REFERENCES "tutor_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classrooms" DROP CONSTRAINT "FK_1867943b22d7ab4762225e77130"`);
        await queryRunner.query(`ALTER TABLE "classrooms" DROP CONSTRAINT "FK_93ac11d9e0692fd8e5c242e5795"`);
        await queryRunner.query(`DROP TABLE "classrooms"`);
    }

}
