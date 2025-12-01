import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Connection error', err);
    } else {
        console.log('Connected:', res.rows[0]);
    }
    pool.end();
});
