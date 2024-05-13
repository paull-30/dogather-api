import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import 'dotenv/config';

import authRoute from './routes/auth.route.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
