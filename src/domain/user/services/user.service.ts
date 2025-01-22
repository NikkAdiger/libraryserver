import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import UserRepository from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { UserStatus } from '../../../types/enums';

@Injectable()
export class UserService {

	constructor(private userRepository: UserRepository) {}

	async create(createUserDto: CreateUserDto) {
		const userEntity: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'> = {
			userName: createUserDto.userName,
			firstName: createUserDto.firstName || null,
			lastName: createUserDto.lastName || null,
			password: createUserDto.password || null,
			email: createUserDto.email || null,
			status: createUserDto.status || UserStatus.ACTIVE,
		  };

		return await this.userRepository.create(userEntity);
	}

	async findOne(id: string) {
		return await this.userRepository.findOne(id);
	}

	async findAllPaginated(page: number, limit: number): Promise<{
		data: UserEntity[];
		total: number;
		page: number;
		limit: number;
	}> {
		return await this.userRepository.findAndCount(page, limit);
	}

	async update(updateUserDto: UpdateUserDto): Promise<UserEntity> {
		const existingUser = await this.userRepository.findOne(updateUserDto.id);

		if (!existingUser) {
			throw new NotFoundException(`User with ID ${updateUserDto.id} not found`);
		}

		const updatedArgs = this.getUpdatedArgs(updateUserDto);

		const updatedUser: Partial<UserEntity> = {
			...existingUser,
			...updatedArgs,
		};

		return await this.userRepository.update(updatedUser as UserEntity);
	}

	private getUpdatedArgs(updateUserDto: UpdateUserDto): Partial<UserEntity> {
		const updatedArgs: Partial<UserEntity> = {};

		if (updateUserDto.userName !== undefined) {
			updatedArgs.userName = updateUserDto.userName;
		}

		if (updateUserDto.firstName !== undefined) {
			updatedArgs.firstName = updateUserDto.firstName;
		}

		if (updateUserDto.lastName !== undefined) {
			updatedArgs.lastName = updateUserDto.lastName;
		}

		if (updateUserDto.password !== undefined) {
			updatedArgs.password = updateUserDto.password;
		}

		if (updateUserDto.email !== undefined) {
			updatedArgs.email = updateUserDto.email;
		}

		if (updateUserDto.status !== undefined) {
			updatedArgs.status = updateUserDto.status;
		}

		return updatedArgs;
	  }
}