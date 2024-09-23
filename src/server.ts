import express from 'express';
import { connectToDb } from './connection.js';
import { startCLI } from './app.js';

// The startServer function is an async function that connects to the database and starts the Express server. It also implements the startCLI function from app.js.
const startServer = async () => {
    await connectToDb();
  
    const PORT = process.env.PORT || 3001;
    const app = express();
  
    // Express middleware
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
  
    
  
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    startCLI();
  };
  
  startServer();