import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1738600879506 implements MigrationInterface {
    name = 'Migrations1738600879506'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admin_profiles" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "admin_id" character varying NOT NULL, "admin_display_name" character varying(100) NOT NULL, "fullname" character varying(100) NOT NULL, "avatar" text, "personal_email" character varying(100), "work_email" character varying(100), "phone_number" character varying(15), "home_address" character varying(255) NOT NULL, "birthday" date NOT NULL, "gender" "public"."admin_profiles_gender_enum" NOT NULL DEFAULT 'MALE', CONSTRAINT "PK_b1702a9b4f1f3c2f9dfb19e5dac" PRIMARY KEY ("admin_id"))`);
        await queryRunner.query(`CREATE TABLE "admins" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "admin_id" character varying NOT NULL, "email" character varying(100) NOT NULL, "phone_number" character varying(15) NOT NULL, "password" character varying(100) NOT NULL, "microsoft_id" character varying, "role_id" character varying, "status" character varying(30), CONSTRAINT "PK_88070d08be64522fc84fdefef85" PRIMARY KEY ("admin_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_051db7d37d478a69a7432df147" ON "admins" ("email") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3a22cd242f3c1fbafa7840a4aa" ON "admins" ("phone_number") `);
        await queryRunner.query(`ALTER TABLE "admin_profiles" ADD CONSTRAINT "FK_b1702a9b4f1f3c2f9dfb19e5dac" FOREIGN KEY ("admin_id") REFERENCES "admins"("admin_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admins" ADD CONSTRAINT "FK_5733c73cd81c566a90cc4802f96" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admins" DROP CONSTRAINT "FK_5733c73cd81c566a90cc4802f96"`);
        await queryRunner.query(`ALTER TABLE "admin_profiles" DROP CONSTRAINT "FK_b1702a9b4f1f3c2f9dfb19e5dac"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3a22cd242f3c1fbafa7840a4aa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_051db7d37d478a69a7432df147"`);
        await queryRunner.query(`DROP TABLE "admins"`);
        await queryRunner.query(`DROP TABLE "admin_profiles"`);
    }

}
