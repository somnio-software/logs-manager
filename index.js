const customWinston = require("./custom_winston");
const loggly = require("./loggly");

exports.createLogger = (env, logsProviderType, options = {}) => {
	let customLogger;
	switch (logsProviderType) {
		case this.LOGS_PROVIDERS_TYPES.WINSTON:
			customLogger = customWinston.getWinstonClient(env);
			break;
		case this.LOGS_PROVIDERS_TYPES.LOGGLY:
			customLogger = loggly.createClient(env, options);
			break;
		default:
			throw new Error("New ");
	}
	return customLogger;
};

exports.LOGS_PROVIDERS_TYPES = {
	WINSTON: 1,
	LOGGLY: 2,
};

exports.createGlobalLogger = (env, logsProviderType, options) => {
	global.logger = this.createLogger(env, logsProviderType, options);
};

exports.injectMorganToApp = (app) => {
	app.use(
		require("morgan")("combined", { stream: global.logger.logglyClient.stream })
	);
	return app;
};
