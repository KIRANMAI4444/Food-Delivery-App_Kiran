import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDb } from './config/db.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/auth', authRoutes);

//Health Check route
app.get('/', (req, res) => {
    res.json({message: 'Food Delivery API is running' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString()});
});

//Start server
const PORT = process.env.PORT || 5000;

connectDb().then(() => {
    app.listen(PORT, () => console.log(`--Server on port : ${PORT}`));
});