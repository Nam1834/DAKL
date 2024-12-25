import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1734513972236 implements MigrationInterface {
    name = 'Migrations1734513972236'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(30) NOT NULL, "description" character varying, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ae4578dcaed5adff96595e6166" ON "role" ("name") `);
        await queryRunner.query(`CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roleId" uuid NOT NULL, "email" character varying(30) NOT NULL, "password" character varying(20) NOT NULL, "fullname" character varying(30) NOT NULL, "address" character varying(150) NOT NULL, "phone_number" character varying(15) NOT NULL, "birthday" date NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_profiles_gender_enum" AS ENUM('MALE', 'FEMALE')`);
        await queryRunner.query(`CREATE TABLE "user_profiles" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "user_id" uuid NOT NULL, "user_display_name" character varying(100) NOT NULL, "fullname" character varying(100) NOT NULL, "avatar" text, "personal_email" character varying(100), "work_email" character varying(100), "phone_number" character varying(15), "home_address" character varying(255) NOT NULL, "birthday" date NOT NULL, "gender" "public"."user_profiles_gender_enum" NOT NULL DEFAULT 'MALE', CONSTRAINT "PK_6ca9503d77ae39b4b5a6cc3ba88" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(100) NOT NULL, "phone_number" character varying(15) NOT NULL, "password" character varying(100) NOT NULL, "microsoft_id" character varying, CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_17d1817f241f10a3dbafb169fd" ON "users" ("phone_number") `);
        await queryRunner.query(`CREATE TYPE "public"."admin_profiles_gender_enum" AS ENUM('MALE', 'FEMALE')`);
        await queryRunner.query(`CREATE TABLE "admin_profiles" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "admin_id" uuid NOT NULL, "admin_display_name" character varying(100) NOT NULL, "fullname" character varying(100) NOT NULL, "avatar" text, "personal_email" character varying(100), "work_email" character varying(100), "phone_number" character varying(15), "home_address" character varying(255) NOT NULL, "birthday" date NOT NULL, "gender" "public"."admin_profiles_gender_enum" NOT NULL DEFAULT 'MALE', CONSTRAINT "PK_b1702a9b4f1f3c2f9dfb19e5dac" PRIMARY KEY ("admin_id"))`);
        await queryRunner.query(`CREATE TABLE "admins" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "admin_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(100) NOT NULL, "phone_number" character varying(15) NOT NULL, "password" character varying(100) NOT NULL, "microsoft_id" character varying, CONSTRAINT "PK_88070d08be64522fc84fdefef85" PRIMARY KEY ("admin_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_051db7d37d478a69a7432df147" ON "admins" ("email") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3a22cd242f3c1fbafa7840a4aa" ON "admins" ("phone_number") `);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_77bf26eef8865441fb9bd53a364" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admin_profiles" ADD CONSTRAINT "FK_b1702a9b4f1f3c2f9dfb19e5dac" FOREIGN KEY ("admin_id") REFERENCES "admins"("admin_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_profiles" DROP CONSTRAINT "FK_b1702a9b4f1f3c2f9dfb19e5dac"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88"`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_77bf26eef8865441fb9bd53a364"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3a22cd242f3c1fbafa7840a4aa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_051db7d37d478a69a7432df147"`);
        await queryRunner.query(`DROP TABLE "admins"`);
        await queryRunner.query(`DROP TABLE "admin_profiles"`);
        await queryRunner.query(`DROP TYPE "public"."admin_profiles_gender_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_17d1817f241f10a3dbafb169fd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "user_profiles"`);
        await queryRunner.query(`DROP TYPE "public"."user_profiles_gender_enum"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ae4578dcaed5adff96595e6166"`);
        await queryRunner.query(`DROP TABLE "role"`);
    }

}
