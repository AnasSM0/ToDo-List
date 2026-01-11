import express from 'express';
// import cors from 'cors'; // REMOVED: Using manual headers
// import helmet from 'helmet'; // REMOVED: extraneous for viva
// import morgan from 'morgan'; // REMOVED: extraneous for viva
import taskRoutes from './routes/taskRoutes';

const app = express();

app.use(express.json());

// Manual CORS to remove dependency
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === 'OPTIONS') {
     return res.status(200).send();
  }
  next();
});

// Simple request logger (replaces morgan)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// app.use(cors());
// app.use(helmet());
// app.use(morgan('dev'));

// Routes
app.use('/api/tasks', taskRoutes);

// Error Handling
// Error Handling - Simplified to basic console log in routes
// app.use(errorHandler);

export default app;
