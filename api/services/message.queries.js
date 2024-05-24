import pool from './db.js';

export const getMessagesFromPost = async (postID) => {
  try {
    const [messages] = await pool.query(
      'SELECT pm.user_id,u.username,pm.message,pm.created_at FROM post_messages pm JOIN user u ON pm.user_id = u.id WHERE pm.post_id = ?',
      [postID]
    );
    return messages;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const createMessage = async (postID, userID, message) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO post_messages (post_id, user_id, message) VALUES (?, ?, ?)',
      [postID, userID, message]
    );
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getCreatedMessage = async (messageID) => {
  try {
    const [message] = await pool.query(
      `
    SELECT pm.post_id, pm.user_id, pm.message, pm.created_at, u.username
    FROM post_messages pm
    JOIN user u ON pm.user_id = u.id
    WHERE pm.id = ?;
  `,
      [messageID]
    );
    return message;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const sendMessageToPost = async (postID, userID, message) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const result = await createMessage(postID, userID, message);
    const messageID = result?.insertId;
    console.log(messageID);
    const [messageCreated] = await getCreatedMessage(messageID);

    await connection.commit();
    return messageCreated;
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Error with transaction:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const isUserInPost = async (postID, userID) => {
  try {
    const [isUser] = await pool.query(
      ' SELECT 1 FROM post_acceptances WHERE post_id = ? AND user_id = ?',
      [postID, userID]
    );
    return isUser.length > 0;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
