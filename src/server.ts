import express from 'express';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';
import { viewDepartmentTable } from './functions.js';

const startServer = async () => {
    await connectToDb();
  
    const PORT = process.env.PORT || 3001;
    const app = express();
  
    // Express middleware
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
  
    // Query database
    async function getAllDepartments() {
      await viewDepartmentTable();
      pool.query('SELECT * FROM department', (err: Error, result: QueryResult) => {
        if (err) {
          console.log(err);
        } else if (result) {
          console.log(result.rows);
        }
      });
    }

    // Call the function to ensure it's used
    getAllDepartments();
  
    // Add your routes here
    app.get('/departments', async (_req, res) => {
      try {
        const result = await pool.query('SELECT * FROM department');
        res.json(result.rows);
      } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching departments');
      }
    });
  
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  };
  
  
  startServer();