require('dotenv').config();

const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === "production";

const connectionString = `postgresql://sfu:XuEbRPpUjkrsea2B2kXvnEoi8DeKhWGS@dpg-cu9n4gogph6c738l64vg-a.oregon-postgres.render.com/login_0f09` // user variable in env

const pool  = new Pool({
	connectionString,
	ssl: {
		rejectUnauthorized: false
	}
});

module.exports = { pool };