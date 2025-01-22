import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1737111642257 implements MigrationInterface {
  name = 'init1737111642257';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "user_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'DELETED');
      CREATE TYPE "book_status_enum" AS ENUM('READ', 'READING', 'WANT_TO_READ');

      CREATE TABLE "user" (
        "id" varchar NOT NULL,
        "user_name" varchar NOT NULL,
        "first_name" varchar,
        "last_name" varchar,
        "password" varchar,
        "email" varchar,
        "status" user_status_enum NOT NULL DEFAULT 'ACTIVE',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user" PRIMARY KEY ("id")
      );

      CREATE TABLE "book" (
        "id" varchar NOT NULL,
        "title" varchar NOT NULL,
        "author" varchar NOT NULL,
        "year" int,
        "genre" varchar,
        "status" book_status_enum,
		"average_rating" DECIMAL(3, 2) DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_book" PRIMARY KEY ("id"),
		CONSTRAINT "UQ_book" UNIQUE ("title", "author")
      );

      CREATE TABLE "book_user" (
        "id" BIGSERIAL PRIMARY KEY,
        "book_id" varchar NOT NULL REFERENCES "book" ("id") ON DELETE CASCADE,
        "user_id" varchar NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
		"user_rating" INT CHECK (user_rating >= 1 AND user_rating <= 10),
		"created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_book_user" UNIQUE ("book_id", "user_id")
      );

      CREATE INDEX "IDX_book_user_book" ON "book_user" ("book_id");
      CREATE INDEX "IDX_book_user_user" ON "book_user" ("user_id");
      CREATE INDEX "IDX_book_status" ON "book" ("status");
      CREATE INDEX "IDX_user_status" ON "user" ("status");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_book_user_book";`);
    await queryRunner.query(`DROP INDEX "IDX_book_user_user";`);
    await queryRunner.query(`DROP INDEX "IDX_book_status";`);
    await queryRunner.query(`DROP INDEX "IDX_user_status";`);

    await queryRunner.query(`DROP TABLE "ratings";`);
    await queryRunner.query(`DROP TABLE "book_user";`);
    await queryRunner.query(`DROP TABLE "book";`);
    await queryRunner.query(`DROP TABLE "user";`);

    await queryRunner.query(`DROP TYPE "user_status_enum";`);
    await queryRunner.query(`DROP TYPE "book_status_enum";`);
  }
}
