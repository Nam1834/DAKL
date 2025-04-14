import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1744623451574 implements MigrationInterface {
    name = 'Migrations1744623451574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "my_curriculumns" DROP CONSTRAINT "FK_120a1d441f6a47254241db81530"`);
        await queryRunner.query(`ALTER TABLE "my_curriculumns" DROP CONSTRAINT "UQ_120a1d441f6a47254241db81530"`);
        await queryRunner.query(`ALTER TABLE "my_curriculumns" ADD CONSTRAINT "FK_120a1d441f6a47254241db81530" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "my_curriculumns" DROP CONSTRAINT "FK_120a1d441f6a47254241db81530"`);
        await queryRunner.query(`ALTER TABLE "my_curriculumns" ADD CONSTRAINT "UQ_120a1d441f6a47254241db81530" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "my_curriculumns" ADD CONSTRAINT "FK_120a1d441f6a47254241db81530" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
