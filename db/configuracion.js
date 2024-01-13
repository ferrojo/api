const initOptions = {};
const pgp = require('pg-promise')(initOptions);

const cn = {
    user: process.env.DB_USER, // Creada como variable de ambiente por seguridad
    password: process.env.DB_PASSWORD, // Creada como variable de ambiente por seguridad
    host: 'localhost',
    port: 5432,
    database: 'metasapp'
};

const db = pgp(cn);

module.exports = db;