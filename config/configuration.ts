import config from 'config';

export default () => {
	const baseConfig = config.util.loadFileConfigs(__dirname);

	return baseConfig;
};