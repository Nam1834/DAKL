import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1737034334750 implements MigrationInterface {
    name = 'Migrations1737034334750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders_items" DROP COLUMN "value_config_id"`);
        await queryRunner.query(`ALTER TABLE "orders_items" ADD "value_config_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders_items" ADD CONSTRAINT "FK_c2c21057a9c6b259b2b870775a9" FOREIGN KEY ("value_config_id") REFERENCES "value_configs"("value-config_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders_items" DROP CONSTRAINT "FK_c2c21057a9c6b259b2b870775a9"`);
        await queryRunner.query(`ALTER TABLE "orders_items" DROP COLUMN "value_config_id"`);
        await queryRunner.query(`ALTER TABLE "orders_items" ADD "value_config_id" character varying NOT NULL`);
    }

}
