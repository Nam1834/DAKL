import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741841006173 implements MigrationInterface {
    name = 'Migrations1741841006173'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP CONSTRAINT "FK_17e26178a201e33850c0b59dbfb"`);
        await queryRunner.query(`ALTER TABLE "tutor_subjects" DROP CONSTRAINT "FK_664d16e6090d860740f7142a106"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP CONSTRAINT "PK_17e26178a201e33850c0b59dbfb"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD CONSTRAINT "PK_17e26178a201e33850c0b59dbfb" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "tutor_subjects" DROP COLUMN "tutor_id"`);
        await queryRunner.query(`ALTER TABLE "tutor_subjects" ADD "tutor_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "PK_6ca9503d77ae39b4b5a6cc3ba88"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "PK_6ca9503d77ae39b4b5a6cc3ba88" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "test_results" DROP CONSTRAINT "FK_e1d145d116b7bdcf870eb5b4754"`);
        await queryRunner.query(`ALTER TABLE "test_results" DROP CONSTRAINT "REL_e1d145d116b7bdcf870eb5b475"`);
        await queryRunner.query(`ALTER TABLE "test_results" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "test_results" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "test_results" ADD CONSTRAINT "UQ_e1d145d116b7bdcf870eb5b4754" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "my_curriculumns" DROP CONSTRAINT "FK_120a1d441f6a47254241db81530"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_96aac72f1574b88752e9fb00089"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "my_curriculumns" DROP CONSTRAINT "REL_120a1d441f6a47254241db8153"`);
        await queryRunner.query(`ALTER TABLE "my_curriculumns" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "my_curriculumns" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "my_curriculumns" ADD CONSTRAINT "UQ_120a1d441f6a47254241db81530" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD CONSTRAINT "FK_17e26178a201e33850c0b59dbfb" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tutor_subjects" ADD CONSTRAINT "FK_664d16e6090d860740f7142a106" FOREIGN KEY ("tutor_id") REFERENCES "tutor_profiles"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "test_results" ADD CONSTRAINT "FK_e1d145d116b7bdcf870eb5b4754" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "my_curriculumns" ADD CONSTRAINT "FK_120a1d441f6a47254241db81530" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "my_curriculumns" DROP CONSTRAINT "FK_120a1d441f6a47254241db81530"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "test_results" DROP CONSTRAINT "FK_e1d145d116b7bdcf870eb5b4754"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88"`);
        await queryRunner.query(`ALTER TABLE "tutor_subjects" DROP CONSTRAINT "FK_664d16e6090d860740f7142a106"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP CONSTRAINT "FK_17e26178a201e33850c0b59dbfb"`);
        await queryRunner.query(`ALTER TABLE "my_curriculumns" DROP CONSTRAINT "UQ_120a1d441f6a47254241db81530"`);
        await queryRunner.query(`ALTER TABLE "my_curriculumns" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "my_curriculumns" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "my_curriculumns" ADD CONSTRAINT "REL_120a1d441f6a47254241db8153" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_96aac72f1574b88752e9fb00089"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "user_id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "my_curriculumns" ADD CONSTRAINT "FK_120a1d441f6a47254241db81530" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "test_results" DROP CONSTRAINT "UQ_e1d145d116b7bdcf870eb5b4754"`);
        await queryRunner.query(`ALTER TABLE "test_results" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "test_results" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "test_results" ADD CONSTRAINT "REL_e1d145d116b7bdcf870eb5b475" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "test_results" ADD CONSTRAINT "FK_e1d145d116b7bdcf870eb5b4754" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "PK_6ca9503d77ae39b4b5a6cc3ba88"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "PK_6ca9503d77ae39b4b5a6cc3ba88" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tutor_subjects" DROP COLUMN "tutor_id"`);
        await queryRunner.query(`ALTER TABLE "tutor_subjects" ADD "tutor_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP CONSTRAINT "PK_17e26178a201e33850c0b59dbfb"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD CONSTRAINT "PK_17e26178a201e33850c0b59dbfb" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "tutor_subjects" ADD CONSTRAINT "FK_664d16e6090d860740f7142a106" FOREIGN KEY ("tutor_id") REFERENCES "tutor_profiles"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD CONSTRAINT "FK_17e26178a201e33850c0b59dbfb" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
