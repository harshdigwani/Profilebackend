const mongoose = require('mongoose');
const logger = require('../startup/logging');
const MONGO_DB = process.env.MONGO_DB;

module.exports = function () {
  mongoose.connect(MONGO_DB, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => logger.info('Connected to MongoDB...'))
    .catch(err => logger.error('Could not connect to MongoDB...\n', err));
}