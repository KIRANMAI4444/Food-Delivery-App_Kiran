import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Health Check route
app.get('/', (req, res) => {
    res.json({message: 'Food Delivery API is running' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString()});
});

//Start server
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log(' MongoDB connected!!!!!');
        app.listen(PORT, () => console.log(`Server on port ${PORT}`));
    })
    .catch((err) => {
        console.error('Mongo connection error: ', err.message);
        process.exit(1);
    });