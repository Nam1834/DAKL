import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1736758496075 implements MigrationInterface {
    name = 'Migrations1736758496075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "value_configs" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "value-config_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" numeric NOT NULL, "coin_config" integer NOT NULL, " url_config" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_85cf273e46af5e29946dc4633b0" PRIMARY KEY ("value-config_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "value_configs"`);
    }

}
