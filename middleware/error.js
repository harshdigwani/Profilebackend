const logger = require('../startup/logging');

module.exports = function (err, req, res, next) {

  /* logging levels in winston
  logging errors
  winston.error(err.message, err);

  error
  warn
  info
  verbose
  debug
  silly  */

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500).json({
    "status": 500,
    "ok": false,
    "message": "Something went wrong..."
  });
  res.render('error');
}