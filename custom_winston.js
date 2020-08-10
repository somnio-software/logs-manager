/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */

const winston = require("winston");
const loggly = require("./loggly");

function reduceLogger(loggerFun, env) {
	return (...args) => {
		const data = args.reduce((acc, itemp) => {
			let result;
			if (Array.isArray(itemp)) result = Array.toString(itemp);
			else if (typeof itemp === "object") result = JSON.stringify(itemp);
			else result = itemp;
			acc.push(`${result} `);
			return acc;
		}, []);
		data.push(env);
		loggerFun(data);
	};
}

function getCustomLoggerMiddleware(logger, env) {
	const customLogger = {};
	customLogger.error = reduceLogger(logger.error, env);
	customLogger.warn = reduceLogger(logger.warn, env);
	customLogger.info = reduceLogger(logger.info, env);
	customLogger.http = reduceLogger(logger.http, env);
	customLogger.verbose = reduceLogger(logger.verbose, env);
	customLogger.debug = reduceLogger(logger.debug, env);
	customLogger.silly = reduceLogger(logger.silly, env);
	return customLogger;
}

exports.getWinstonClient = (env) => {
	console.log("env", env);
	const logger = winston.createLogger({
		level: "debug",
		transports: [
			new winston.transports.File({
				filename: `${__dirname}/error.log`,
				level: "error",
			}),
			new winston.transports.File({
				filename: `${__dirname}/combined.log`,
			}),
		],
		colorize: true,
	});
	if (env !== "production") {
		logger.add(
			new winston.transports.Console({
				format: winston.format.simple(),
			})
		);
	}

	const customLogger = getCustomLoggerMiddleware(logger, env);
	return customLogger;
};

exports.getlogglyClient = (env, token, subdomain, generalTags) => {
	const logglyTransport = loggly.createClient(token, subdomain, generalTags);
	const logger = winston.createLogger({
		level: "debug",
		transports: [logglyTransport],
		colorize: true,
	});
	if (env !== "production") {
		logger.add(
			new winston.transports.Console({
				format: winston.format.simple(),
			})
		);
	}

	const customLogger = getCustomLoggerMiddleware(logger, env);
	return customLogger;
};
