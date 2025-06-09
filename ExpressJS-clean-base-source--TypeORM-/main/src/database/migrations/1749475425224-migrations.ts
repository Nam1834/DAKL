import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1749475425224 implements MigrationInterface {
    name = 'Migrations1749475425224'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "manage_bankings" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "manage_banking_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tutor_id" character varying NOT NULL, "coin_withdraw" integer NOT NULL, "got_value" integer NOT NULL, CONSTRAINT "PK_e4b0b3262cce7dcaf31d5fbe9a0" PRIMARY KEY ("manage_banking_id"))`);
        await queryRunner.query(`ALTER TABLE "manage_bankings" ADD CONSTRAINT "FK_9efbc5b98f0573091fd4e7923eb" FOREIGN KEY ("tutor_id") REFERENCES "tutor_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "manage_bankings" DROP CONSTRAINT "FK_9efbc5b98f0573091fd4e7923eb"`);
        await queryRunner.query(`DROP TABLE "manage_bankings"`);
    }

}
