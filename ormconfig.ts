import path from 'path';

const appRootDir = path.resolve(__dirname);

process.env['NODE_CONFIG_DIR'] = path.join(appRootDir, '/config/');

import config from 'config';
import { DataSource } from 'typeorm';
import { IConfigDb } from './src/types/interfaces';

const dbConfig = config.get<IConfigDb>('db');

export default new DataSource({
	type: 'postgres',
	...dbConfig,
	entities: [
		appRootDir + '/src/**/entities/*.ts',
	],
	migrationsTableName: 'migrations',
	migrations: [
		appRootDir + '/src/migrations/**/*.ts',
	],
	migrationsRun: (dbConfig.runMigrations === true || dbConfig.runMigrations === 'true') ? true : false,
});