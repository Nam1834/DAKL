import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1744048631504 implements MigrationInterface {
    name = 'Migrations1744048631504'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "my_tutor_items" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "my_tutor_id" uuid NOT NULL, "tutor_id" character varying NOT NULL, CONSTRAINT "PK_b68d723aff9bed3ab592cce0f9f" PRIMARY KEY ("my_tutor_id", "tutor_id"))`);
        await queryRunner.query(`CREATE TABLE "my_tutors" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "my_tutor_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, CONSTRAINT "REL_1adb45c4e2099cc6287ba9ba72" UNIQUE ("user_id"), CONSTRAINT "PK_4cd02c4809eda8cc1612981aaf9" PRIMARY KEY ("my_tutor_id"))`);
        await queryRunner.query(`ALTER TABLE "my_tutor_items" ADD CONSTRAINT "FK_6b8de7555894e5385d463550bd9" FOREIGN KEY ("my_tutor_id") REFERENCES "my_tutors"("my_tutor_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "my_tutor_items" ADD CONSTRAINT "FK_8488353da8bc2bbd77c67cac8b1" FOREIGN KEY ("tutor_id") REFERENCES "tutor_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "my_tutors" ADD CONSTRAINT "FK_1adb45c4e2099cc6287ba9ba72c" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "my_tutors" DROP CONSTRAINT "FK_1adb45c4e2099cc6287ba9ba72c"`);
        await queryRunner.query(`ALTER TABLE "my_tutor_items" DROP CONSTRAINT "FK_8488353da8bc2bbd77c67cac8b1"`);
        await queryRunner.query(`ALTER TABLE "my_tutor_items" DROP CONSTRAINT "FK_6b8de7555894e5385d463550bd9"`);
        await queryRunner.query(`DROP TABLE "my_tutors"`);
        await queryRunner.query(`DROP TABLE "my_tutor_items"`);
    }

}
