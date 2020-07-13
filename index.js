const express = require('express');
const app = express();
const logger = require('./startup/logging');
const port = process.env.PORT || 5000;

require('./startup/config')(); // loading configuration
require('./startup/routes')(app); // calling routes
require('./startup/db')();  // connecting to database
require('./startup/validation')(); // loading validaions
require('./startup/prod')(app); // loading production modules

// server listeng on port
const server = app.listen(port, () => logger.info(`Server Listening to port ${port}`));

module.exports = server;