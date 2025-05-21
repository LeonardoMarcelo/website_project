// server.js
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 3000;

app.use(express.json())

app.use('/', authRoutes)





app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
