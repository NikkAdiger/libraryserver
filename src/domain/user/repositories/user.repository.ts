import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Injectable()
export default class UserRepository {

	constructor(
		@InjectRepository(UserEntity) private userEntityRepository: Repository<UserEntity>,
	) {}

	async findAndCount(page: number, limit: number): Promise<{
		data: UserEntity[];
		total: number;
		page: number;
		limit: number;
	}> {
		const [data, total] = await this.userEntityRepository.findAndCount({
			skip: (page - 1) * limit,
			take: limit,
		});

		return {
			data,
			total,
			page,
			limit,
		};
	}

	async findOne(id: string): Promise<UserEntity> {
		return this.userEntityRepository.findOne({ where: { id } });
	}

	async create(entity: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserEntity> {
		const id = uuid();
		const now = new Date(Date.now()).toISOString();

		return this.userEntityRepository.save({
			...entity,
			id,
			createdAt: now,
			updatedAt: now,
		});
	}

	async update(entity: Omit<UserEntity, 'createdAt' | 'updatedAt'>): Promise<UserEntity> {
		const now = new Date(Date.now()).toISOString();

		return await this.userEntityRepository.save({
			...entity,
			updatedAt: now,
		});
	}
}