/* eslint-disable no-console */
require('babel-register');
require('dotenv').config();

const displayRoutes = require('express-routemap');

const app = require('./src/app.js').default;

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Application started on port ' + process.env.PORT);
  displayRoutes(app);
});
