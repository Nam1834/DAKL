import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1748029226683 implements MigrationInterface {
    name = 'Migrations1748029226683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" ADD "classroom_id" uuid`);
        await queryRunner.query(`ALTER TABLE "meetings" ADD CONSTRAINT "FK_5befcfedb28339329b34c228cdc" FOREIGN KEY ("classroom_id") REFERENCES "classrooms"("classroom_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" DROP CONSTRAINT "FK_5befcfedb28339329b34c228cdc"`);
        await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "classroom_id"`);
    }

}
