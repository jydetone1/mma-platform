import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatemmaplatformTable1752155807290 implements MigrationInterface {
    name = 'CreatemmaplatformTable1752155807290'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "fight_history" ("id" SERIAL NOT NULL, "outcome" character varying NOT NULL, "method" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "fighterId" integer, "fightId" integer, CONSTRAINT "PK_7e5928f081e8ec5301ac38653fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rankings" ("id" SERIAL NOT NULL, "weight_class" character varying NOT NULL, "points" integer NOT NULL DEFAULT '0', "rank_position" integer NOT NULL, "win_percentage" double precision NOT NULL DEFAULT '0', "last_fight_date" date, "fighterId" integer, CONSTRAINT "PK_05d87d598d485338c9980373d20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "fighters" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "nickname" character varying, "nationality" character varying, "date_of_birth" date, "weight_class" character varying NOT NULL, CONSTRAINT "PK_181eba8698d5defe223daa78fba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "fights" ("id" SERIAL NOT NULL, "result" character varying, "round" integer, "time" TIME, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "eventId" integer, "fighter1Id" integer, "fighter2Id" integer, CONSTRAINT "PK_f58a76631bc2c2bdef2a8628c95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "events" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "date" date NOT NULL, "location" character varying, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "fight_history" ADD CONSTRAINT "FK_c6872948b80211e92ef3cbf3b83" FOREIGN KEY ("fighterId") REFERENCES "fighters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fight_history" ADD CONSTRAINT "FK_5a769ffe6943afec4050c2df98b" FOREIGN KEY ("fightId") REFERENCES "fights"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rankings" ADD CONSTRAINT "FK_97fa3b60be070f2bb262b9de34e" FOREIGN KEY ("fighterId") REFERENCES "fighters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fights" ADD CONSTRAINT "FK_76786f5b3eee0a81261b3ae9c10" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fights" ADD CONSTRAINT "FK_80228c1cbc5834703f25512f1ec" FOREIGN KEY ("fighter1Id") REFERENCES "fighters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fights" ADD CONSTRAINT "FK_0ffc5e2969ed66f848550a6efed" FOREIGN KEY ("fighter2Id") REFERENCES "fighters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fights" DROP CONSTRAINT "FK_0ffc5e2969ed66f848550a6efed"`);
        await queryRunner.query(`ALTER TABLE "fights" DROP CONSTRAINT "FK_80228c1cbc5834703f25512f1ec"`);
        await queryRunner.query(`ALTER TABLE "fights" DROP CONSTRAINT "FK_76786f5b3eee0a81261b3ae9c10"`);
        await queryRunner.query(`ALTER TABLE "rankings" DROP CONSTRAINT "FK_97fa3b60be070f2bb262b9de34e"`);
        await queryRunner.query(`ALTER TABLE "fight_history" DROP CONSTRAINT "FK_5a769ffe6943afec4050c2df98b"`);
        await queryRunner.query(`ALTER TABLE "fight_history" DROP CONSTRAINT "FK_c6872948b80211e92ef3cbf3b83"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TABLE "fights"`);
        await queryRunner.query(`DROP TABLE "fighters"`);
        await queryRunner.query(`DROP TABLE "rankings"`);
        await queryRunner.query(`DROP TABLE "fight_history"`);
    }

}
