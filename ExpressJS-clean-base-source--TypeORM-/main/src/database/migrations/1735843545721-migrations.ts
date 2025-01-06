import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1735843545721 implements MigrationInterface {
    name = 'Migrations1735843545721'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "majors" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "major_id" character varying NOT NULL, "major_name" character varying NOT NULL, CONSTRAINT "PK_d535afcba79d9c733217b8956d7" PRIMARY KEY ("major_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "majors"`);
    }

}
