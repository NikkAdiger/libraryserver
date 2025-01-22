import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultUserAndBooks1737121646546 implements MigrationInterface {
	name = 'AddDefaultUserAndBooks1737121646546';

	public async up(queryRunner: QueryRunner): Promise<void> {
		// Insert a default admin and user
		await queryRunner.query(`
		INSERT INTO "user" (id, user_name, first_name, last_name, password, email, status, created_at, updated_at)
		VALUES
			(gen_random_uuid(),'admin','admin','admin',null,'admin@gmail.com','ACTIVE',now(),now()),
			(gen_random_uuid(),'user','user','user',null,'user@gmail.com','ACTIVE',now(),now());
		`);

		const adminIdResult = await queryRunner.query(`
			SELECT id FROM "user" WHERE user_name = 'admin';
		`);
		const adminId = adminIdResult[0]?.id;

		const userIdResult = await queryRunner.query(`
			SELECT id FROM "user" WHERE user_name = 'user';
		`);
		const userId = userIdResult[0]?.id;

		if (!adminId) {
			throw new Error('Failed to insert default admin user');
		}

		// Insert 15 default books
		await queryRunner.query(`
		INSERT INTO "book" (id, title, author, year, genre, status, average_rating, created_at, updated_at)
		VALUES
			(gen_random_uuid(), 'Book 1', 'Author 1', 2001, 'Fiction', null, null, now(), now()),
			(gen_random_uuid(), 'Book 2', 'Author 2', 2002, 'Non-Fiction', 'READING', null, now(), now()),
			(gen_random_uuid(), 'Book 3', 'Author 3', 2003, 'Mystery', 'WANT_TO_READ', null, now(), now()),
			(gen_random_uuid(), 'Book 4', 'Author 4', 2004, 'Sci-Fi', 'READ', null, now(), now()),
			(gen_random_uuid(), 'Book 5', 'Author 5', 2005, 'Fantasy', null, null, now(), now()),
			(gen_random_uuid(), 'Book 6', 'Author 6', 2006, 'Romance', 'WANT_TO_READ', null, now(), now()),
			(gen_random_uuid(), 'Book 7', 'Author 7', 2007, 'Thriller', null, null, now(), now()),
			(gen_random_uuid(), 'Book 8', 'Author 8', 2008, 'Horror', 'READING', null, now(), now()),
			(gen_random_uuid(), 'Book 9', 'Author 9', 2009, 'Biography', 'WANT_TO_READ', null, now(), now()),
			(gen_random_uuid(), 'Book 10', 'Author 10', 2010, 'History', 'READ', null, now(), now()),
			(gen_random_uuid(), 'Book 11', 'Author 11', 2010, 'Fiction', 'WANT_TO_READ', null, now(), now()),
			(gen_random_uuid(), 'Book 12', 'Author 12', 2010, 'Mystery', null, null, now(), now()),
			(gen_random_uuid(), 'Book 13', 'Author 13', 2010, 'History', 'READ', null, now(), now()),
			(gen_random_uuid(), 'Book 14', 'Author 14', 2010, 'Horror', null, null, now(), now()),
			(gen_random_uuid(), 'Book 15', 'Author 15', 2010, 'Romance', 'READ', null, now(), now());
		`);

		const booksResult = await queryRunner.query(`
			SELECT id FROM "book" WHERE title LIKE 'Book %';
		`);

		const bookIds = booksResult.map((book: { id: string }) => book.id);
		const limitedNookIds = bookIds.slice(0, 7);

		for (const bookId of bookIds) {
			await queryRunner.query(`
				INSERT INTO "book_user" (book_id, user_id)
				VALUES ('${bookId}', '${adminId}');
			`);
		}

		if (userId) {
			for (const bookId of limitedNookIds) {
				await queryRunner.query(`
					INSERT INTO "book_user" (book_id, user_id)
					VALUES ('${bookId}', '${userId}');
				`);
			}
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {

		const adminIdResult = await queryRunner.query(`
			SELECT id FROM "user" WHERE user_name = 'admin';
		`);
		const adminId = adminIdResult[0]?.id;

		if (adminId) {
		await queryRunner.query(`
			DELETE FROM "book_user" WHERE user_id = '${adminId}';
		`);

		await queryRunner.query(`
			DELETE FROM "user"
			WHERE id = '${adminId}';
		`);
		}

		await queryRunner.query(`
			DELETE FROM "book"
			WHERE title LIKE 'Book %';
		`);
	}
}
