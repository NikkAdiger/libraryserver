import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import Constants from '../../../types/constants';

@Controller('users')
export class UserController {
	constructor(private readonly usersService: UserService) {}

	@Get()
	async findAll(
		@Query('page') page: string = '1',
		@Query('limit') limit: string = `${Constants.MAX_USERS_PER_PAGE}`,
	) {
		const pageNumber = parseInt(page, 10) || 1;
		const pageSize = parseInt(limit, 10) || Constants.MAX_USERS_PER_PAGE;

		return await this.usersService.findAllPaginated(pageNumber, pageSize);
	}

	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.usersService.findOne(id);
	}

	@Patch()
	update(@Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(updateUserDto);
	}
}