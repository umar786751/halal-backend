import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1758631961027 implements MigrationInterface {
    name = 'InitialMigration1758631961027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."deliveries_status_enum" AS ENUM('requested', 'accepted', 'pickup_arrived', 'picked_up', 'in_transit', 'delivered', 'cancelled', 'failed')`);
        await queryRunner.query(`CREATE TABLE "deliveries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "external_delivery_id" character varying, "status" "public"."deliveries_status_enum" NOT NULL DEFAULT 'requested', "pickup_address" character varying, "dropoff_address" character varying, "pickup_lat" numeric(10,6), "pickup_lng" numeric(10,6), "dropoff_lat" numeric(10,6), "dropoff_lng" numeric(10,6), "estimated_cost" numeric(10,2), "final_cost" numeric(10,2), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "orderId" uuid, CONSTRAINT "REL_f7433e3639e213f901e22cf864" UNIQUE ("orderId"), CONSTRAINT "PK_a6ef225c5c5f0974e503bfb731f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "deliveries" ADD CONSTRAINT "FK_f7433e3639e213f901e22cf8640" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deliveries" DROP CONSTRAINT "FK_f7433e3639e213f901e22cf8640"`);
        await queryRunner.query(`DROP TABLE "deliveries"`);
        await queryRunner.query(`DROP TYPE "public"."deliveries_status_enum"`);
    }

}
