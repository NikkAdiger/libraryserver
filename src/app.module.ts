import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './domain/user/users.module';
import { BooksModule } from './domain/book/books.module';
import { TypeOrmConfigService } from './shared/typeorm.service';
import configuration from '../config/configuration';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [ configuration ],
		}),
		TypeOrmModule.forRootAsync({
			useClass: TypeOrmConfigService,
		}),
		UsersModule,
		BooksModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
