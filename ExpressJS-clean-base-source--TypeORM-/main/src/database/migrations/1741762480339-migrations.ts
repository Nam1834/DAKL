import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741762480339 implements MigrationInterface {
    name = 'Migrations1741762480339'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders_items" DROP CONSTRAINT "FK_c2c21057a9c6b259b2b870775a9"`);
        await queryRunner.query(`ALTER TABLE "value_configs" DROP CONSTRAINT "PK_85cf273e46af5e29946dc4633b0"`);
        await queryRunner.query(`ALTER TABLE "value_configs" DROP COLUMN "value-config_id"`);
        await queryRunner.query(`ALTER TABLE "value_configs" ADD "value-config_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "value_configs" ADD CONSTRAINT "PK_85cf273e46af5e29946dc4633b0" PRIMARY KEY ("value-config_id")`);
        await queryRunner.query(`ALTER TABLE "orders_items" DROP COLUMN "value_config_id"`);
        await queryRunner.query(`ALTER TABLE "orders_items" ADD "value_config_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders_items" ADD CONSTRAINT "FK_c2c21057a9c6b259b2b870775a9" FOREIGN KEY ("value_config_id") REFERENCES "value_configs"("value-config_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders_items" DROP CONSTRAINT "FK_c2c21057a9c6b259b2b870775a9"`);
        await queryRunner.query(`ALTER TABLE "orders_items" DROP COLUMN "value_config_id"`);
        await queryRunner.query(`ALTER TABLE "orders_items" ADD "value_config_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "value_configs" DROP CONSTRAINT "PK_85cf273e46af5e29946dc4633b0"`);
        await queryRunner.query(`ALTER TABLE "value_configs" DROP COLUMN "value-config_id"`);
        await queryRunner.query(`ALTER TABLE "value_configs" ADD "value-config_id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "value_configs" ADD CONSTRAINT "PK_85cf273e46af5e29946dc4633b0" PRIMARY KEY ("value-config_id")`);
        await queryRunner.query(`ALTER TABLE "orders_items" ADD CONSTRAINT "FK_c2c21057a9c6b259b2b870775a9" FOREIGN KEY ("value_config_id") REFERENCES "value_configs"("value-config_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
