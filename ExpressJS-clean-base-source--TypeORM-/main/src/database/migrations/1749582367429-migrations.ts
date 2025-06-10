import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1749582367429 implements MigrationInterface {
    name = 'Migrations1749582367429'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classroom_assessments" ADD "meeting_id" uuid`);
        await queryRunner.query(`ALTER TABLE "classroom_assessments" ADD CONSTRAINT "FK_ce4269c2712d2d98ada765f7329" FOREIGN KEY ("meeting_id") REFERENCES "meetings"("meeting_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classroom_assessments" DROP CONSTRAINT "FK_ce4269c2712d2d98ada765f7329"`);
        await queryRunner.query(`ALTER TABLE "classroom_assessments" DROP COLUMN "meeting_id"`);
    }

}
