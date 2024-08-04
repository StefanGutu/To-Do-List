const { Client } = require('pg');

const client = new Client({
    user: process.env.DB_USER,
    host: 'my_postgres_container',
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

client.connect();

module.exports = client;