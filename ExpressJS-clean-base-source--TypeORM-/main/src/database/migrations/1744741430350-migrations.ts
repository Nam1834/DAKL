import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1744741430350 implements MigrationInterface {
    name = 'Migrations1744741430350'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_requests" ADD "tutor_level_solved_id" character varying`);
        await queryRunner.query(`ALTER TABLE "tutor_requests" ADD CONSTRAINT "FK_3307c7d541520bbeb221521e32e" FOREIGN KEY ("tutor_level_solved_id") REFERENCES "tutor_levels"("tutor_level_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tutor_requests" DROP CONSTRAINT "FK_3307c7d541520bbeb221521e32e"`);
        await queryRunner.query(`ALTER TABLE "tutor_requests" DROP COLUMN "tutor_level_solved_id"`);
    }

}
