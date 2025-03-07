import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741282221871 implements MigrationInterface {
    name = 'Migrations1741282221871'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tests" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "test_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" character varying(255), CONSTRAINT "PK_f8c701fbb2c6f4fb85cebfa0000" PRIMARY KEY ("test_id"))`);
        await queryRunner.query(`CREATE TABLE "test_questions" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "test_question_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "test_id" uuid NOT NULL, "question_number" integer NOT NULL, "question_text" character varying(255) NOT NULL, "option_a" character varying(255) NOT NULL, "option_b" character varying(255) NOT NULL, "option_c" character varying(255) NOT NULL, "option_d" character varying(255) NOT NULL, "correct_answer" character varying(1) NOT NULL, CONSTRAINT "PK_86fd994cbf03ec41f3a4f9c6b65" PRIMARY KEY ("test_question_id"))`);
        await queryRunner.query(`CREATE TABLE "test_results" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "test_result_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "points" integer NOT NULL, "test_date" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(255) NOT NULL, "description" character varying(255), CONSTRAINT "REL_e1d145d116b7bdcf870eb5b475" UNIQUE ("user_id"), CONSTRAINT "PK_fc5f305eee40db683957290c144" PRIMARY KEY ("test_result_id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "total_test_points" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "test_questions" ADD CONSTRAINT "FK_5badfac5ec550e555213ad2e5bc" FOREIGN KEY ("test_id") REFERENCES "tests"("test_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "test_results" ADD CONSTRAINT "FK_e1d145d116b7bdcf870eb5b4754" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test_results" DROP CONSTRAINT "FK_e1d145d116b7bdcf870eb5b4754"`);
        await queryRunner.query(`ALTER TABLE "test_questions" DROP CONSTRAINT "FK_5badfac5ec550e555213ad2e5bc"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "total_test_points"`);
        await queryRunner.query(`DROP TABLE "test_results"`);
        await queryRunner.query(`DROP TABLE "test_questions"`);
        await queryRunner.query(`DROP TABLE "tests"`);
    }

}
