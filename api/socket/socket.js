import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import { getPostsWhichUserJoined } from '../services/user.queries.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL],
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  const postId = socket.handshake.query.postId;
  console.log('user connected', userId);

  const handleConnection = async () => {
    if (userId && postId) {
      const userPosts = await getPostsWhichUserJoined(userId);
      const isUserAssociatedWithPost = userPosts.some(
        (post) => post.id === postId
      );
      if (isUserAssociatedWithPost) {
        socket.join(`post-${postId}`);
      }
    }
    handleConnection();
  };

  socket.on('disconnect', () => {
    console.log('user disconnected', userId);
  });
});

export { app, server, io };
