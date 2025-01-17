import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1736951421366 implements MigrationInterface {
    name = 'Migrations1736951421366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "orders_items" ("order_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" numeric NOT NULL, "value_config_id" character varying NOT NULL, CONSTRAINT "PK_53c21b56c3eebe5cd88525ccd6e" PRIMARY KEY ("order_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('WAITING_FOR_PAYMENT', 'CANCELED', 'PAID', 'FAILED')`);
        await queryRunner.query(`CREATE TABLE "orders" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "order_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "total_price" numeric NOT NULL, "payment_id" uuid, "user_id" uuid NOT NULL, "status" "public"."orders_status_enum" NOT NULL DEFAULT 'WAITING_FOR_PAYMENT', "customer_fullname" character varying, "customer_email" character varying, "customer_phone" character varying, CONSTRAINT "REL_5b3e94bd2aedc184f9ad8c1043" UNIQUE ("payment_id"), CONSTRAINT "PK_cad55b3cb25b38be94d2ce831db" PRIMARY KEY ("order_id"))`);
        await queryRunner.query(`CREATE TABLE "payments" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" character varying, "update_by" character varying, "delete_at" TIMESTAMP, "payment_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pay_type" character varying NOT NULL, "payment_status" boolean NOT NULL DEFAULT false, "amount" integer NOT NULL, "pay_info" jsonb, CONSTRAINT "PK_8866a3cfff96b8e17c2b204aae0" PRIMARY KEY ("payment_id"))`);
        await queryRunner.query(`ALTER TABLE "orders_items" ADD CONSTRAINT "FK_53c21b56c3eebe5cd88525ccd6e" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_5b3e94bd2aedc184f9ad8c10439" FOREIGN KEY ("payment_id") REFERENCES "payments"("payment_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_5b3e94bd2aedc184f9ad8c10439"`);
        await queryRunner.query(`ALTER TABLE "orders_items" DROP CONSTRAINT "FK_53c21b56c3eebe5cd88525ccd6e"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`DROP TABLE "orders_items"`);
    }

}
