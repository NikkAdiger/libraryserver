import pg, { types } from 'pg';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join, normalize } from 'path';
import { IConfigDb } from '../types/interfaces';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {

	constructor(private config: ConfigService) {}

	createTypeOrmOptions(): TypeOrmModuleOptions {
		pg.types.setTypeParser(types.builtins.INT8, parseInt);
		pg.types.setTypeParser(types.builtins.FLOAT8, parseFloat);
		pg.types.setTypeParser(types.builtins.NUMERIC, parseFloat);
		pg.types.setTypeParser(types.builtins.TIMESTAMP, (value: string | null) => value);

		const BIG_INT_ARRAY_PG_TYPE = 1016;
		const parseBigIntArray = pg.types.getTypeParser(BIG_INT_ARRAY_PG_TYPE);
		pg.types.setTypeParser(BIG_INT_ARRAY_PG_TYPE, value => parseBigIntArray(value).map((value: string) => parseInt(value)));

		const dbConfig = this.config.getOrThrow<IConfigDb>('db');

		return {
			type: 'postgres',
			host: dbConfig.host,
			port: dbConfig.port,
			database: dbConfig.database,
			username: dbConfig.username,
			password: dbConfig.password,
			synchronize: dbConfig.synchronize,
			logging: dbConfig.logging,
			autoLoadEntities: true,
			migrations: [ normalize(join(__dirname, '../migrations/*.js')) ],
			migrationsRun: !!dbConfig.runMigrations,
			retryAttempts: 5,
			retryDelay: 5000,
		};
	}
}
