import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookUserEntity } from '../entities/bookUser.entity';

@Injectable()
export default class BookUserRepository {

	constructor(
		@InjectRepository(BookUserEntity) private bookUserEntityRepository: Repository<BookUserEntity>,
	) {}

	async create(entity: Omit<BookUserEntity, 'id' | 'userRating' | 'createdAt' | 'updatedAt'>): Promise<BookUserEntity> {
		const now = new Date(Date.now()).toISOString();

		return this.bookUserEntityRepository.save({
			...entity,
			createdAt: now,
			updatedAt: now,
		});
	}

	async findOne(userId: string, bookId: string): Promise<BookUserEntity> {
		return this.bookUserEntityRepository.findOne({ where: { userId, bookId } });
	}
}