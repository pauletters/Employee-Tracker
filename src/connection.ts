// dotenv is being used to load the environment variables from the .env file.
import dotenv from 'dotenv';
dotenv.config();

// pg is being used to connect to the database. The Pool class is being imported from pg. The pool object has all of the connection details.
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: 'localhost',
  database: process.env.DB_NAME,
  port: 5432,
});

// The connectToDb function is an async function that connects to the database using the information from the pool object.
const connectToDb = async () => {
  try {
    await pool.connect();
    console.log('Connected to the database.');
  } catch (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
};

export { pool, connectToDb };
