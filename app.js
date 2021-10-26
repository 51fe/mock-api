const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const reportRouter = require('./routes/report');
const articleRouter = require('./routes/article');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());

// router
app.use('/', indexRouter);
app.use('/api/report', reportRouter);
app.use('/api/article', articleRouter);
module.exports = app;