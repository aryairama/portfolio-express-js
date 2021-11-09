/* eslint-disable no-unused-vars */
const express = require('express');
const path = require('path');
require('dotenv').config();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const { responseError } = require('./src/helpers/helpers');

const app = express();
const port = process.env.PORT;
app.use('/public', express.static(path.resolve('./public')));
app.use(fileUpload());
app.use(
  cors({
    credentials: JSON.parse(process.env.CREDENTIALS),
    origin(origin, callback) {
      if (process.env.CORS_ORIGIN.indexOf(origin) !== -1 || origin === undefined) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use('*', (req, res, next) => {
  next(new Error('Endpoint Not Found'));
});
app.use((err, req, res, next) => {
  responseError(res, 'Error', 500, err.message, []);
});
app.listen(port, () => {
  console.log(`server running port ${port}`);
});
