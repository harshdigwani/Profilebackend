// my routes
const express = require('express');
const logger = require('./logging');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');

// middlewares
const auth = require('../routes/auth');
const profile = require('../routes/profile');
const users = require('../routes/users');
const blogs = require('../routes/blogs');
const projects = require('../routes/projects');
const category = require('../routes/category');

const error = require('../middleware/error');

module.exports = function (app) {

  // Middlewares
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static('public'));
  app.use(helmet());
  // app.use(cookieParser);
  app.use(cors());
  // app.options('*', cors());
  // enabling logging only in development
  if (app.get('env') == 'development') {
    logger.info('Debugging Enabled...');
    app.use(morgan('combined', { stream: logger.stream }));
  }

  // home page routes
  app.get('/', (req, res) => {
    return res.status(200).send({ "message": 'hello' });
  });
  app.use('/api/auth', auth);
  app.use('/api/profile', profile);
  app.use('/api/users', users);
  app.use('/api/blogs', blogs);
  app.use('/api/projects', projects);
  app.use('/api/category', category);

  // after routes error handler
  app.use(error);

}
