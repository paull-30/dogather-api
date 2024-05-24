import {
  getMessagesFromPost,
  isUserInPost,
  sendMessageToPost,
} from '../services/message.queries.js';
import { io } from '../socket/socket.js';

export const getMessages = async (req, res) => {
  const postID = req.params.id;
  const userID = req.userId;

  try {
    const isUser = await isUserInPost(postID, userID);
    if (!isUser)
      res.status(403).json({
        error: 'User is not authorized to send messages to this post',
      });
    const messages = await getMessagesFromPost(postID);
    if (!messages) res.status(404).json('No messages found!');
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching messages' });
  }
};

export const sendMessage = async (req, res) => {
  const postID = req.params.id;
  const userID = req.userId;
  const { message } = req.body;

  try {
    const isUser = await isUserInPost(postID, userID);
    if (!isUser)
      res.status(403).json({
        error: 'User is not authorized to send messages to this post',
      });
    const messageCreated = await sendMessageToPost(postID, userID, message);
    res.status(201).json(messageCreated);
    io.to(`post-${postID}`).emit('newMessage', messageCreated);
  } catch (error) {
    console.error('Error sending message:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while sending the message' });
  }
};
