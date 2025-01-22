import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1737408091913 implements MigrationInterface {
    name = 'Migrations1737408091913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "curriculumns" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "curriculumn_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "curriculumn_name" character varying NOT NULL, "curriculumn_major" character varying NOT NULL, "curriculumn_url" character varying NOT NULL, "desciption" character varying NOT NULL, "status" character varying NOT NULL, "role_user_created" character varying NOT NULL, CONSTRAINT "PK_71230d423884ece99a4c7a6475e" PRIMARY KEY ("curriculumn_id"))`);
        await queryRunner.query(`CREATE TABLE "my_curriculumn_items" ("my_curriculumn_id" uuid NOT NULL, "curriculumn_id" uuid NOT NULL, CONSTRAINT "PK_72101b504f1dfd6a812a77050af" PRIMARY KEY ("my_curriculumn_id", "curriculumn_id"))`);
        await queryRunner.query(`CREATE TABLE "my_curriculumns" ("my_curriculumn_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, CONSTRAINT "REL_120a1d441f6a47254241db8153" UNIQUE ("user_id"), CONSTRAINT "PK_53fcad66c152912a3a3ef19c361" PRIMARY KEY ("my_curriculumn_id"))`);
        await queryRunner.query(`ALTER TABLE "my_curriculumn_items" ADD CONSTRAINT "FK_7b274db9e29b16071f64bf6b543" FOREIGN KEY ("my_curriculumn_id") REFERENCES "my_curriculumns"("my_curriculumn_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "my_curriculumn_items" ADD CONSTRAINT "FK_a519a8b7b969384c6191458f2e7" FOREIGN KEY ("curriculumn_id") REFERENCES "curriculumns"("curriculumn_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "my_curriculumns" ADD CONSTRAINT "FK_120a1d441f6a47254241db81530" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "my_curriculumns" DROP CONSTRAINT "FK_120a1d441f6a47254241db81530"`);
        await queryRunner.query(`ALTER TABLE "my_curriculumn_items" DROP CONSTRAINT "FK_a519a8b7b969384c6191458f2e7"`);
        await queryRunner.query(`ALTER TABLE "my_curriculumn_items" DROP CONSTRAINT "FK_7b274db9e29b16071f64bf6b543"`);
        await queryRunner.query(`DROP TABLE "my_curriculumns"`);
        await queryRunner.query(`DROP TABLE "my_curriculumn_items"`);
        await queryRunner.query(`DROP TABLE "curriculumns"`);
    }

}
