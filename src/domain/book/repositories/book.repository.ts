import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from '../entities/book.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { BookUserEntity } from '../entities/bookUser.entity';
import { IGetAllBooks } from '../types/interfaces';
import Constants from '../../../types/constants';

type BookWithUserId = BookEntity & { userId?: string };

@Injectable()
export default class BookRepository {

	constructor(
		@InjectRepository(BookEntity) private bookEntityRepository: Repository<BookEntity>,
		@InjectRepository(BookUserEntity) private bookUserEntityRepository: Repository<BookUserEntity>,
	) {}

	async getAllBooks({ userId, search, page, limit }: IGetAllBooks): Promise<{
		data: BookWithUserId[];
		total: number;
		page: number;
		limit: number;
	}> {
		const offset = (page - 1) * limit;

		const whereConditions: string[] = [];
		const queryParams: any[] = [];

		if (userId) {
			whereConditions.push(`book_user.user_id = $${queryParams.length + 1}`);
			queryParams.push(userId);
		}

		if (search && search.length > Constants.MIN_CHARACTERS_SEARCH - 1) {
			whereConditions.push(`(book.title ILIKE $${queryParams.length + 1} OR book.author ILIKE $${queryParams.length + 2})`);
			queryParams.push(`%${search}%`, `%${search}%`);
		}

		const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

		const dataQuery = `
			SELECT book_user.user_id, book.*
			FROM book
			LEFT JOIN book_user ON book.id = book_user.book_id
			${whereClause}
			LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
		`;

		queryParams.push(limit, offset);

		const data = await this.bookEntityRepository.query(dataQuery, queryParams);

		// Count query
		const countQuery = `
			SELECT COUNT(*)::int AS total
			FROM book
			LEFT JOIN book_user ON book.id = book_user.book_id
			${whereClause}
		`;

		const [{ total }] = await this.bookEntityRepository.query(countQuery, queryParams.slice(0, -2)); // Exclude limit and offset

		return {
			data,
			total,
			page,
			limit,
		};
	}

	async findOne(id: string): Promise<BookEntity> {
		return this.bookEntityRepository.findOne({ where: { id } });
	}

	async findOneByTitleAndAuthor(title: string, author:string): Promise<BookEntity> {
		return this.bookEntityRepository.findOne({ where: { title, author } });
	}

	async create(entity: Omit<BookEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<BookEntity> {
		const id = uuid();
		const now = new Date(Date.now()).toISOString();

		return this.bookEntityRepository.save({
			...entity,
			id,
			createdAt: now,
			updatedAt: now,
		});
	}

	async update(entity: Partial<BookEntity>): Promise<BookEntity> {
		const now = new Date(Date.now()).toISOString();

		return await this.bookEntityRepository.save({
			...entity,
			updatedAt: now,
		});
	}

	async getRatingCount(userId: string, bookId: string): Promise<number> {
		const query = `
			SELECT user_rating AS count
			FROM book_user
			WHERE book_user.user_id = $1
			AND book_user.book_id = $2
		`;

		const [{ count }] = await this.bookUserEntityRepository.query(query, [userId, bookId]);

		return count;
	}

	async getAverageRating(userId: string, bookId: string): Promise<number> {
		const query = `
			SELECT AVG(user_rating) AS average_rating
			FROM book_user
			WHERE user_id = $1
			AND book_id = $2
		`;

		const result = await this.bookUserEntityRepository.query(query, [userId, bookId]);

		return result[0]?.average_rating ? parseFloat(result[0].average_rating) : null;
	}

	async updateRating(id: number, rating: number): Promise<BookUserEntity> {
		const now = new Date(Date.now()).toISOString();

		return this.bookUserEntityRepository.save({
			id,
			user_rating: rating,
			updatedAt: now,
		});
	}
}