import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BooksService } from '../services/books.service';
import Constants from '../../../types/constants';
import { AddBookToUserDto, CreateBookDto, UpdateBookDto, UpdateRatingDto } from '../dto/book.dto';

@Controller('books')
export class BooksController {
	constructor(
		private readonly bookService: BooksService
	) {}

	@Get()
	async getAllBooks(
		@Query('userId') userId: string,
		@Query('search') search: string,
		@Query('page') page: string = '1',
		@Query('limit') limit: string = `${Constants.MAX_BOOKS_PER_PAGE}`,
	) {
		const pageNumber = parseInt(page, 10) || 1;
		const pageSize = parseInt(limit, 10) || Constants.MAX_BOOKS_PER_PAGE;

		return await this.bookService.getAllBooks({ userId, search, page: pageNumber, limit: pageSize });
	}

	@Post()
	create(@Body() createBookDto: CreateBookDto) {
		return this.bookService.create(createBookDto);
	}

	@Post('user')
	addExistingBookToUserLibrary(@Body() addBookToUserDto: AddBookToUserDto) {
		return this.bookService.addExistingBookToUserLibrary(addBookToUserDto);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.bookService.findOne(id);
	}

	@Patch()
	update(@Body() updateBookDto: UpdateBookDto) {
		return this.bookService.update(updateBookDto);
	}

	@Patch('ratings')
	updateRating(@Body() updateRatingDto: UpdateRatingDto) {
		return this.bookService.updateRating(updateRatingDto);
	}
}
