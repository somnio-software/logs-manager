/* Loggly test */
const logglyToken = "e10e63dc-9d8e-4743-abea-948538cfd54e";
const subdomainLoggly = "somnio.loggly.com";

const loggs = require("./index");

loggs.createGlobalLogger("development", loggs.LOGS_PROVIDERS_TYPES.LOGGLY, {
	subdomain: subdomainLoggly,
	token: logglyToken,
	generalTags: ["main"],
});

logger.info("Loggly test", { info: "My info" });

/* Winston test */
loggs.createGlobalLogger("development", loggs.LOGS_PROVIDERS_TYPES.WINSTON);

logger.info("Normal winston info test", { info: "Normal winston" });
logger.error("Normal winston error test", { info: "Normal winston" });
