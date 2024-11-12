import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectToMongoDb from './db/connectDb.js';
import authRouter from './routes/auth.routes.js';
import campaignRouter from './routes/campaign.routes.js';
const app = express();
dotenv.config();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRouter);
app.use('/api/campaign',campaignRouter);
app.listen(PORT,()=>{
    connectToMongoDb();
    console.log(`Server is connected at ${PORT}`);
})