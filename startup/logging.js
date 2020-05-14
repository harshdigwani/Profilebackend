const winston = require('winston');
require('winston-mongodb');

// module.exports = function () {
/*
process.on('uncaughtException', (err) => {
  // exception handling for synchronous code
  console.log("WE HAVE GOT UNCAUGHT EXCEPTION");
  winston.error(err.message, err);
  
  // exit the process when exception is occured is best
  process.exit(1);
})
 
process.on('unhandledRejection', (err) => {
  // exception handling for synchronous code
  console.log("WE HAVE GOT UNHANDLED REJECTION");
  winston.error(err.message, err);
  process.exit(1);
})
 
// Promise.reject(new Error("something went wrong")).then();
 
// winston.add(winston.transports.File, { filename: "logfile.log" });
*/
// }


let options = {
  file: {
    level: 'info',
    filename: "./logs/app.log",
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: true,
    colorize: true,
  },
  mongodb: {
    level: 'error',
    db : process.env.MONGO_DB,
    handleExceptions: true,
    json: true,
    colorize: false,
  }
};

let logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
  ],
  exitOnError: true, // do not exit on handled exceptions
});

logger.stream = {
  write: function (message, encoding) {
    logger.info(message);
  },
};

module.exports = logger