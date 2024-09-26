import express, { Application } from "express";
import authRouter from './routes/auth.js';
import cors from 'cors';

const PORT:number = 3000;

const app:Application = express();
app.use(cors());
app.use(express.json());

app.use('/api',authRouter);

app.listen(PORT,()=>{console.log("server is on");})
