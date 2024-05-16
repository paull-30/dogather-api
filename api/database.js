import mysql from 'mysql2';

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

export async function checkUsername(username) {
  const [rows] = await pool.query('SELECT * FROM user WHERE username = ?', [
    username,
  ]);
  return rows[0];
}

export async function createUser(username, email, hPassword, role) {
  await pool.query(
    'INSERT INTO user (username, email, password, role) VALUES (?,?,?,?)',
    [username, email, hPassword, role]
  );
}

export async function getUser(id) {
  const [user] = await pool.query('SELECT * FROM user WHERE id = ?', [id]);
  return user[0];
}

export async function getUserByUsername(username) {
  const [user] = await pool.query('SELECT id FROM user WHERE username = ?', [
    username,
  ]);
  return user[0].id;
}

export async function getUsers() {
  const [users] = await pool.query('SELECT username, email, role FROM user');
  return users;
}

export async function updateUserInfo(id, fieldsToUpdate) {
  const setClause = Object.keys(fieldsToUpdate)
    .map((key) => `${key} = ?`)
    .join(', ');
  const values = [...Object.values(fieldsToUpdate), id];

  const [result] = await pool.query(
    `UPDATE user SET ${setClause} WHERE id = ?`,
    values
  );

  return result;
}

export async function deleteUserByID(id) {
  await pool.query('DELETE FROM user WHERE id = ?', [id]);
}

export async function getPosts() {
  const [posts] = await pool.query('SELECT * from post');
  return posts;
}

export async function getPost(id) {
  const [post] = await pool.query('SELECT * from post WHERE id = ?', [id]);
  return post[0];
}

export async function newPost(
  title,
  description,
  searching_for_skills,
  status,
  createdBy
) {
  try {
    const result = await pool.query(
      'INSERT INTO post (title, description, searching_for_skills, status, created_by) VALUES (?, ?, ?, ?, ?)',
      [title, description, searching_for_skills, status, createdBy]
    );

    const insertId = result[0].insertId;

    const [createdPost] = await pool.query('SELECT * FROM post WHERE id = ?', [
      insertId,
    ]);
    return createdPost[0];
  } catch (error) {
    throw new Error('Failed to create new post: ' + error.message);
  }
}

export async function updatePostById(
  title,
  description,
  searching_for_skills,
  status,
  postID
) {
  try {
    await pool.query(
      'UPDATE post SET title = ?, description = ?, searching_for_skills = ?, status = ? WHERE id = ?',
      [title, description, searching_for_skills, status, postID]
    );
  } catch (error) {
    console.error('Error updating post:', error.message);
  }
}

export async function deletePostById(id) {
  await pool.query('DELETE FROM post WHERE id = ?', [id]);
}

export async function createPostInvitation(postID, userID) {
  try {
    await pool.query(
      'INSERT INTO post_invitations (post_id, user_id) VALUES (?, ?)',
      [postID, userID]
    );
  } catch (error) {
    throw error;
  }
}

export async function checkPostInvitation(postID, userID) {
  const query =
    'SELECT COUNT(*) AS count FROM post_invitations WHERE post_id = ? AND user_id = ?';
  const [rows] = await pool.query(query, [postID, userID]);
  const invitationCount = rows[0].count;
  return invitationCount > 0;
}

export async function checkPostApplication(postID, userID) {
  const query =
    'SELECT COUNT(*) AS count FROM post_applications WHERE post_id = ? AND user_id = ?';
  const [rows] = await pool.query(query, [postID, userID]);
  const applicationCount = rows[0].count;
  return applicationCount > 0;
}

export async function createPostApplication(postID, userID) {
  await pool.query(
    'INSERT INTO post_applications (post_id, user_id) VALUES (?, ?)',
    [postID, userID]
  );
}

export async function getUsersWhoApplied(postID) {
  const query = `
    SELECT u.id, u.username,u.bio,u.skills
    FROM user u
    JOIN post_applications pa ON u.id = pa.user_id
    WHERE pa.post_id = ?
  `;
  const [rows] = await pool.query(query, [postID]);
  return rows;
}

export async function removeUserApplication(connection, postID, userID) {
  const query =
    'DELETE FROM post_applications WHERE post_id = ? AND user_id = ?';
  await connection.query(query, [postID, userID]);
}

export async function addUserAcceptance(connection, postID, userID) {
  const query = 'INSERT INTO post_acceptances (post_id, user_id) VALUES (?, ?)';
  await connection.query(query, [postID, userID]);
}

export async function acceptUsersApplications(postID, userID) {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    await removeUserApplication(connection, postID, userID);
    await addUserAcceptance(connection, postID, userID);

    await connection.commit();
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
}
