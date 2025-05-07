import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1746592975952 implements MigrationInterface {
    name = 'Migrations1746592975952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "manage_payments" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "manage_payment_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "tutor_id" character varying NOT NULL, "coin_of_user_payment" integer NOT NULL, "coin_of_tutor_receive" integer NOT NULL, "coin_of_web_receive" integer NOT NULL, CONSTRAINT "PK_516b807fb20c0cae54ca4098cbc" PRIMARY KEY ("manage_payment_id"))`);
        await queryRunner.query(`ALTER TABLE "manage_payments" ADD CONSTRAINT "FK_15033995dc79fa8488049ed61aa" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "manage_payments" ADD CONSTRAINT "FK_f723f8a348ad839c459c97045dc" FOREIGN KEY ("tutor_id") REFERENCES "tutor_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "manage_payments" DROP CONSTRAINT "FK_f723f8a348ad839c459c97045dc"`);
        await queryRunner.query(`ALTER TABLE "manage_payments" DROP CONSTRAINT "FK_15033995dc79fa8488049ed61aa"`);
        await queryRunner.query(`DROP TABLE "manage_payments"`);
    }

}
