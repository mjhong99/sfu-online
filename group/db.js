var { Pool } = require("pg");

var Pool = require("pg").Pool;

const pool = new Pool({
    user: "sfu",
    database: "sfu",
    password: "sfu123",
    host: "localhost",
    port: 5432
});

module.exports = pool;
