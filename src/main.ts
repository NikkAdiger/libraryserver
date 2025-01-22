import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: '1',
	});

	app.useGlobalPipes(new ValidationPipe());

	app.enableCors();

	const configService = await app.resolve(ConfigService);

	const port = configService.get('api.port');

	await app.listen(port);
	console.log(`Server listening on http://localhost:${port}`);
}
bootstrap();
