require('dotenv').config();

const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === "production";

const connectionString = `postgres://mtqdanyrvlrcwq:6cc163c3af3becc6caf44163dc91dd105228933f5f500e158d79aa1408d47960@ec2-54-162-119-125.compute-1.amazonaws.com:5432/db5bvst2limdhb` // user variable in env

const pool  = new Pool({
	connectionString,
	ssl: {
		rejectUnauthorized: false
	}
});

module.exports = { pool };