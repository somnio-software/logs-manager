function reduceLogger(loggerFun, _, requestMetadata) {
	return (...args) => {
		const data = args.reduce((acc, itemp) => {
			let result;
			if (Array.isArray(itemp)) result = Array.toString(itemp);
			else if (typeof itemp === "object") result = JSON.stringify(itemp);
			else result = itemp;
			acc.push(result);
			return acc;
		}, []);
		const message = data[0];
		loggerFun(message, { data, ...requestMetadata });
	};
}

exports.createClient = (env, options) => {
	const winston = require("winston");
	const { Loggly } = require("winston-loggly-bulk");
	const {
		subdomain,
		generalTags,
		token,
		injectMorganToApp,
		app,
		requestMetadata,
	} = options;
	// eslint-disable-next-line new-cap
	const logglyClient = new winston.createLogger({
		transports: [
			new Loggly({
				inputToken: token,
				subdomain,
				tags: [...(generalTags || []), env],
				json: true,
			}),
		],
		colorize: true,
	});
	if (env !== "production") {
		logglyClient.add(
			new winston.transports.Console({
				format: winston.format.simple(),
			})
		);
	}
	logglyClient.stream = {
		write: function write(message, _) {
			logger.info("Api Request", message.trim());
		},
	};
	if (injectMorganToApp) {
		app.use(require("morgan")("combined", { stream: logglyClient.stream }));
	}
	const customLogger = {};
	customLogger.error = reduceLogger(
		logglyClient.error,
		"error",
		requestMetadata
	);
	customLogger.warn = reduceLogger(logglyClient.warn, "warn", requestMetadata);
	customLogger.info = reduceLogger(logglyClient.info, "info", requestMetadata);
	customLogger.http = reduceLogger(logglyClient.http, "http", requestMetadata);
	customLogger.verbose = reduceLogger(
		logglyClient.verbose,
		"verbose",
		requestMetadata
	);
	customLogger.debug = reduceLogger(
		logglyClient.debug,
		"debug",
		requestMetadata
	);
	customLogger.silly = reduceLogger(
		logglyClient.silly,
		"silly",
		requestMetadata
	);
	customLogger.logglyClient = logglyClient;
	return customLogger;
};
