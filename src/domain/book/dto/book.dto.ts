import { IsString, IsOptional, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { BookStatus } from '../../../types/enums';

export class BookDto {
	@IsNumber()
	@IsOptional()
	year: number;

	@IsString()
	@IsOptional()
	genre: string;

	@IsEnum(BookStatus)
	@IsOptional()
	status: BookStatus;

	@IsNumber()
	@IsOptional()
	averageRating: number;
}

export class CreateBookDto extends BookDto {
	@IsString()
	title: string;

	@IsString()
	author: string;

	@IsString()
	@IsOptional()
	userId: string;
}

export class UpdateBookDto extends BookDto {
	@IsString()
	id: string;

	@IsString()
	@IsOptional()
	title: string;

	@IsString()
	@IsOptional()
	author: string;
}

export class UpdateRatingDto {
	@IsString()
	userId: string;

	@IsString()
	bookId: string;

	@IsNumber()
	@Min(1, { message: 'Rating must be at least 1' })
	@Max(10, { message: 'Rating must not exceed 10' })
	rating: number;
}

export class AddBookToUserDto {
	@IsString()
	userId: string;

	@IsString()
	bookId: string;
}