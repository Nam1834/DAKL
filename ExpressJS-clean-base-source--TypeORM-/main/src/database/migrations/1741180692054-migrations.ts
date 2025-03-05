import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741180692054 implements MigrationInterface {
    name = 'Migrations1741180692054'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subjects" DROP CONSTRAINT "FK_c7fab727d3110f37eb6b88508de"`);
        await queryRunner.query(`ALTER TABLE "subjects" DROP COLUMN "major_name"`);
        await queryRunner.query(`ALTER TABLE "subjects" DROP COLUMN "majorMajorId"`);
        await queryRunner.query(`ALTER TABLE "subjects" ADD "major_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subjects" ADD CONSTRAINT "FK_aaf41354eadcf6dc08e5795fcb8" FOREIGN KEY ("major_id") REFERENCES "majors"("major_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subjects" DROP CONSTRAINT "FK_aaf41354eadcf6dc08e5795fcb8"`);
        await queryRunner.query(`ALTER TABLE "subjects" DROP COLUMN "major_id"`);
        await queryRunner.query(`ALTER TABLE "subjects" ADD "majorMajorId" character varying`);
        await queryRunner.query(`ALTER TABLE "subjects" ADD "major_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subjects" ADD CONSTRAINT "FK_c7fab727d3110f37eb6b88508de" FOREIGN KEY ("majorMajorId") REFERENCES "majors"("major_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
