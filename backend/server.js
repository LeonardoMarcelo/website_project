// server.js
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
const port = 5000;
const corsOptions = {
  origin: '*', // Ou um domínio específico, tipo 'https://seufrontend.com'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json())

app.use('/', authRoutes)

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
