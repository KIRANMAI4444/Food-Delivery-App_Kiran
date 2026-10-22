import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDb } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import restaurantRoutes from './routes/restaurant.routes.js';
import menuRoutes from './routes/menu.routes.js';
import cartRoutes from './routes/cart.routes.js';


dotenv.config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/restaurants/:restaurantId/menu', menuRoutes);
app.use('/api/cart', cartRoutes);

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