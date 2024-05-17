export async function getUserByUsername(username) {
  const [user] = await pool.query('SELECT id FROM user WHERE username = ?', [
    username,
  ]);
  return user[0].id;
}

export async function getUsers() {
  const [users] = await pool.query(
    'SELECT id,username, email, bio, role, skills FROM user'
  );
  return users;
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

export const getUsersWorkingOnPost = async (postID) => {
  try {
    const query = `
        SELECT u.id, u.username, u.email, u.bio,u.skills
        FROM post_acceptances pa
        JOIN user u ON pa.user_id = u.id
        WHERE pa.post_id = ?
      `;

    const [users] = await pool.query(query, [postID]);

    return users;
  } catch (error) {
    console.error('Failed to fetch users working on post:', error);
    throw new Error('Failed to fetch users working on post');
  }
};
