import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from "mongoose";
dotenv.config({});

// Validate critical environment variables
const requiredEnvVars = ['MONGODB_URL', 'SECRET_KEY'];
const missing = requiredEnvVars.filter(v => !process.env[v]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  console.error('Please set these variables in Vercel project settings or your .env file');
}

const app = express();

import userRoute from './routes/userRoute.js';
import companyRoute from './routes/companyRoute.js';
import JobRoute from './routes/jobRoute.js';
import applicationRoute from './routes/applicationRoute.js';

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: "https://job-portal-client-jade-eight.vercel.app",
  credentials: true,
}));

// routes
app.get('/', (req, res) => {
  return res.send('Hello, World!');
});

// api
app.use('/api/v1/user', userRoute);
app.use('/api/v1/company', companyRoute);
app.use('/api/v1/job', JobRoute);
app.use('/api/v1/application', applicationRoute);

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("Mongoose connect Successfully");
}).catch((err) => {
  console.log("Error while connecting to MongoDB", err);
});

export default app;