import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import 'dotenv/config';

import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';
import taskRoute from './routes/task.route.js';
import messageRoute from './routes/message.route.js';

import { notFound } from './middleware/notFound.js';
import { app, server } from './socket/socket.js';

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts/:id/tasks', taskRoute);
app.use('/api/posts/:id/messages', messageRoute);
app.use('/api/posts', postRoute);

app.use('*', notFound);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
