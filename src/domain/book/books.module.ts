import { Module } from '@nestjs/common';
import { BooksService } from './services/books.service';
import { BooksController } from './controllers/books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { BookUserEntity } from './entities/bookUser.entity';
import BookRepository from './repositories/book.repository';
import BookUserRepository from './repositories/bookUser.repository';

@Module({
	imports: [
		TypeOrmModule.forFeature([BookEntity, BookUserEntity]),
	],
	controllers: [BooksController],
	providers: [BooksService, BookRepository, BookUserRepository],
	exports: [BooksService],
})
export class BooksModule {}
