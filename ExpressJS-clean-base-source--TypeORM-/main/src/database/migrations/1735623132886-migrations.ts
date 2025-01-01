import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1735623132886 implements MigrationInterface {
    name = 'Migrations1735623132886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permissions" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "permission_id" character varying NOT NULL, "description" character varying(255) NOT NULL, CONSTRAINT "PK_1717db2235a5b169822e7f753b1" PRIMARY KEY ("permission_id"))`);
        await queryRunner.query(`CREATE TABLE "role_permissions" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "role_id" character varying NOT NULL, "permission_id" character varying NOT NULL, CONSTRAINT "PK_25d24010f53bb80b78e412c9656" PRIMARY KEY ("role_id", "permission_id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "role_id" character varying(70) NOT NULL, "role_name" character varying(90) NOT NULL, CONSTRAINT "PK_09f4c8130b54f35925588a37b6a" PRIMARY KEY ("role_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_profiles_gender_enum" AS ENUM('MALE', 'FEMALE')`);
        await queryRunner.query(`CREATE TABLE "user_profiles" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "user_id" uuid NOT NULL, "user_display_name" character varying(100), "fullname" character varying(100) NOT NULL, "avatar" text, "personal_email" character varying(100), "work_email" character varying(100), "phone_number" character varying(15), "home_address" character varying(255) NOT NULL, "birthday" date, "gender" "public"."user_profiles_gender_enum" NOT NULL DEFAULT 'MALE', CONSTRAINT "PK_6ca9503d77ae39b4b5a6cc3ba88" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(100) NOT NULL, "phone_number" character varying(15) NOT NULL, "password" character varying(100) NOT NULL, "microsoft_id" character varying, "role_id" character varying DEFAULT 'USER', CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_17d1817f241f10a3dbafb169fd" ON "users" ("phone_number") `);
        await queryRunner.query(`CREATE TYPE "public"."admin_profiles_gender_enum" AS ENUM('MALE', 'FEMALE')`);
        await queryRunner.query(`CREATE TABLE "admin_profiles" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "admin_id" uuid NOT NULL, "admin_display_name" character varying(100) NOT NULL, "fullname" character varying(100) NOT NULL, "avatar" text, "personal_email" character varying(100), "work_email" character varying(100), "phone_number" character varying(15), "home_address" character varying(255) NOT NULL, "birthday" date NOT NULL, "gender" "public"."admin_profiles_gender_enum" NOT NULL DEFAULT 'MALE', CONSTRAINT "PK_b1702a9b4f1f3c2f9dfb19e5dac" PRIMARY KEY ("admin_id"))`);
        await queryRunner.query(`CREATE TABLE "admins" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "admin_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(100) NOT NULL, "phone_number" character varying(15) NOT NULL, "password" character varying(100) NOT NULL, "microsoft_id" character varying, "role_id" character varying, "status" character varying(30), CONSTRAINT "PK_88070d08be64522fc84fdefef85" PRIMARY KEY ("admin_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_051db7d37d478a69a7432df147" ON "admins" ("email") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3a22cd242f3c1fbafa7840a4aa" ON "admins" ("phone_number") `);
        await queryRunner.query(`CREATE TABLE "notifications" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "notification_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "propose_id" character varying, "receivers" jsonb, "content" text, "title_name" character varying(255) NOT NULL, "noti_type" character varying(50) NOT NULL, CONSTRAINT "PK_eaedfe19f0f765d26afafa85956" PRIMARY KEY ("notification_id"))`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permissions"("permission_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admin_profiles" ADD CONSTRAINT "FK_b1702a9b4f1f3c2f9dfb19e5dac" FOREIGN KEY ("admin_id") REFERENCES "admins"("admin_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admins" ADD CONSTRAINT "FK_5733c73cd81c566a90cc4802f96" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admins" DROP CONSTRAINT "FK_5733c73cd81c566a90cc4802f96"`);
        await queryRunner.query(`ALTER TABLE "admin_profiles" DROP CONSTRAINT "FK_b1702a9b4f1f3c2f9dfb19e5dac"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
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
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
    }

}
