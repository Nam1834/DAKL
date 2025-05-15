import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1747287780360 implements MigrationInterface {
    name = 'Migrations1747287780360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "classroom_assessments" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "classroom_assessment_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "tutor_id" character varying NOT NULL, "classroom_id" uuid NOT NULL, "classroom_evaluation" numeric(2,1), "status" character varying NOT NULL DEFAULT 'IN_SESSION', CONSTRAINT "PK_8878c4dc3c6bf66a35c8635a56d" PRIMARY KEY ("classroom_assessment_id"))`);
        await queryRunner.query(`ALTER TABLE "classroom_assessments" ADD CONSTRAINT "FK_d02df11a09286cc250cb0f774a4" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classroom_assessments" ADD CONSTRAINT "FK_322ecbdafa6877d4883274718c1" FOREIGN KEY ("tutor_id") REFERENCES "tutor_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classroom_assessments" ADD CONSTRAINT "FK_6316c8b22f30d3b3342d27025a2" FOREIGN KEY ("classroom_id") REFERENCES "classrooms"("classroom_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classroom_assessments" DROP CONSTRAINT "FK_6316c8b22f30d3b3342d27025a2"`);
        await queryRunner.query(`ALTER TABLE "classroom_assessments" DROP CONSTRAINT "FK_322ecbdafa6877d4883274718c1"`);
        await queryRunner.query(`ALTER TABLE "classroom_assessments" DROP CONSTRAINT "FK_d02df11a09286cc250cb0f774a4"`);
        await queryRunner.query(`DROP TABLE "classroom_assessments"`);
    }

}
