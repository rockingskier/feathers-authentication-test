const knex = require('knex');

import config from '../../knexfile.js';

const db = knex(config[process.env.DATABASE_ENV]);


export default db;
