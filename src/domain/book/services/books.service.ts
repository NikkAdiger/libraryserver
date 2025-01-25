import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import BookRepository from '../repositories/book.repository';
import { AddBookToUserDto, CreateBookDto, UpdateBookDto, UpdateRatingDto } from '../dto/book.dto';
import { BookEntity } from '../entities/book.entity';
import { BookStatus } from '../../../types/enums';
import { IGetAllBooks } from '../types/interfaces';
import BookUserRepository from '../repositories/bookUser.repository';
import { BookUserEntity } from '../entities/bookUser.entity';
import Constants from '../../../types/constants';
import { DataSource, IsNull, Not } from 'typeorm';

@Injectable()
export class BooksService {
	constructor(
		private readonly dataSource: DataSource,
		private bookRepository: BookRepository,
		private bookUserRepository: BookUserRepository,
	) {}

	async create(createBookDto: CreateBookDto) {
		const existingBook = await this.bookRepository.findOneByTitleAndAuthor(createBookDto.title, createBookDto.author);

		if (existingBook) {
			throw new ConflictException(`Book with title ${createBookDto.title} and author ${createBookDto.author} already exist`)
		}

		const bookEntity: Omit<BookEntity, 'id' | 'createdAt' | 'updatedAt'> = {
			title: createBookDto.title,
			author: createBookDto.author,
			year: createBookDto.year || null,
			genre: createBookDto.genre || null,
			status: createBookDto.status || BookStatus.READ,
			averageRating: null,
		};

		const book = await this.bookRepository.create(bookEntity);

		if (createBookDto.userId) {
			await this.addExistingBookToUserLibrary({
				bookId: book.id,
				userId: createBookDto.userId,
			});
		}

		return book;
	}

	async addExistingBookToUserLibrary(addBookToUserDto: AddBookToUserDto) {
		const { bookId, userId } = addBookToUserDto;
		const existingBookForUser = await this.bookUserRepository.findOne(userId, bookId);

		if (existingBookForUser) {
			return existingBookForUser;
		}

		const bookUser = await this.bookUserRepository.create({
			bookId,
			userId,
		});

		return bookUser;
	}

	async findOne(id: string) {
		return await this.bookRepository.findOne(id);
	}

	async delete(id: string) {
		const existingBook = await this.bookRepository.findOne(id);

		if (!existingBook) {
			throw new NotFoundException(`Book with ID ${id} not found`);
		}

		return await this.bookRepository.delete(id);
	}

	async findOneByTitleAndAuthor(title: string, author:string) {
		return await this.bookRepository.findOneByTitleAndAuthor(title, author);
	}

	async getAllBooks({ userId, search, page, limit }: IGetAllBooks): Promise<{
		data: BookEntity[];
		total: number;
		page: number;
		limit: number;
	}> {
		const { data, total } = await this.bookRepository.getAllBooks({ userId, search, page, limit });

		return { data, total, page, limit };
	}

	async update(updateBookDto: UpdateBookDto): Promise<BookEntity> {
		const existingBook = await this.bookRepository.findOne(updateBookDto.id);

		if (!existingBook) {
			throw new NotFoundException(`Book with ID ${updateBookDto.id} not found`);
		}

		const updatedArgs = this.getUpdatedArgs(updateBookDto);

		const updatedUser: Partial<BookEntity> = {
			...existingBook,
			...updatedArgs,
		};

		return await this.bookRepository.update(updatedUser as BookEntity);
	}

	async updateRating(updateRatingDto: UpdateRatingDto): Promise<BookUserEntity> {
		const { bookId, userId, rating } = updateRatingDto;

		return await this.dataSource.transaction(async (manager) => {
			const bookUserRepository = manager.getRepository(BookUserEntity);
			const bookRepository = manager.getRepository(BookEntity);

			const bookUser = await bookUserRepository.findOne({
			  where: { bookId, userId },
			});

			if (!bookUser) {
			  throw new NotFoundException(`BookUser with bookId ${bookId} and userId ${userId} not found`);
			}

			bookUser.userRating = rating;
			const updatedRating = await bookUserRepository.save(bookUser);

			const ratingCount = await bookUserRepository.count({
				where: {
					bookId,
					userRating: Not(IsNull()),
			  },});

			if (ratingCount >= Constants.MIN_RATING_COUNT) {
				const averageRatingResult = await bookUserRepository.query(
					`
						SELECT AVG(user_rating)::NUMERIC(10, 2) AS average_rating
						FROM book_user
						WHERE book_id = $1 AND user_rating IS NOT NULL
					`,
					[bookId],
				);

			  const averageRating = parseFloat(averageRatingResult[0]?.average_rating || '0');

			  await bookRepository.update(bookId, { averageRating });
			}

			return updatedRating;
		  });
	}

	private getUpdatedArgs(updateBookDto: UpdateBookDto): Partial<BookEntity> {
		const updatedArgs: Partial<BookEntity> = {};

		if (updateBookDto.title) {
			updatedArgs.title = updateBookDto.title;
		}

		if (updateBookDto.author) {
			updatedArgs.author = updateBookDto.author;
		}

		if (updateBookDto.genre !== undefined) {
			updatedArgs.genre = updateBookDto.genre;
		}

		if (updateBookDto.status !== undefined) {
			updatedArgs.status = updateBookDto.status;
		}

		if (updateBookDto.year !== undefined) {
			updatedArgs.year = updateBookDto.year;
		}

		return updatedArgs;
	}
}