import pool from './db.js';

//GET ALL POSTS
export const getPosts = async () => {
  try {
    const [posts] = await pool.query('SELECT * from post');
    return posts;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//GET A POST BY ID
export const getPost = async (id) => {
  try {
    const [post] = await pool.query('SELECT * from post WHERE id = ?', [id]);
    return post[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//CREATE A POST AND RETURN IT
const newPost = async (
  connection,
  id,
  title,
  description,
  status,
  createdBy
) => {
  try {
    await pool.query(
      'INSERT INTO post (id, title, description, status, created_by) VALUES (?, ?, ?, ?, ?)',
      [id, title, description, status, createdBy]
    );

    const [postResult] = await pool.query('SELECT * FROM post WHERE id = ?', [
      id,
    ]);
    return postResult[0];
  } catch (error) {
    console.error('Failed to create new post:', error);
    throw new Error('Failed to create new post: ' + error.message);
  }
};

//CREATE SKILLS FOR POST
const addSkillsToPost = async (connection, id, skills) => {
  try {
    const skillValues = skills.map((skill) => [id, skill]);
    const insertQuery = 'INSERT INTO posts_skills (post_id, skill) VALUES ?';
    await connection.query(insertQuery, [skillValues]);

    const [skillsResult] = await connection.query(
      'SELECT skill FROM posts_skills WHERE post_id = ?',
      [id]
    );

    const postSkills = skillsResult.map((row) => row.skill);
    return postSkills;
  } catch (error) {
    console.error('Error adding skills to the post:', error);
    throw new Error('Failed to add skills to post: ' + error.message);
  }
};

//CREATE A POST WITH SKILLS AND RETURN IT
export const createPost = async (
  id,
  title,
  description,
  status,
  createdBy,
  skills
) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const post = await newPost(
      connection,
      id,
      title,
      description,
      status,
      createdBy
    );
    const postSkills = await addSkillsToPost(connection, id, skills);

    await connection.commit();
    return { ...post, skills: postSkills };
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

//UPDATE POST INFO
export const updatePostById = async (title, description, status, postID) => {
  try {
    await pool.query(
      'UPDATE post SET title = ?, description = ?, status = ? WHERE id = ?',
      [title, description, status, postID]
    );
  } catch (error) {
    console.error('Error updating post:', error.message);
    throw error;
  }
};

//DELETE POST
export const deletePostById = async (id) => {
  try {
    await pool.query('DELETE FROM post WHERE id = ?', [id]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//CHECK IF USER ALREADY IS INVITED TO POST
export const checkPostInvitation = async (postID, userID) => {
  try {
    const query =
      'SELECT COUNT(*) AS count FROM post_invitations WHERE post_id = ? AND user_id = ?';
    const [rows] = await pool.query(query, [postID, userID]);
    const invitationCount = rows[0].count;
    return invitationCount > 0;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//INVITE USER TO WORK ON POST
export const createPostInvitation = async (postID, userID) => {
  try {
    await pool.query(
      'INSERT INTO post_invitations (post_id, user_id) VALUES (?, ?)',
      [postID, userID]
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//CHECK IF USER ALREADY APPLIED TO POST
export const checkPostApplication = async (postID, userID) => {
  try {
    const query =
      'SELECT COUNT(*) AS count FROM post_applications WHERE post_id = ? AND user_id = ?';
    const [rows] = await pool.query(query, [postID, userID]);
    const applicationCount = rows[0].count;
    return applicationCount > 0;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//ALLOW USER TO APPLY TO POST
export const createPostApplication = async (postID, userID) => {
  try {
    await pool.query(
      'INSERT INTO post_applications (post_id, user_id) VALUES (?, ?)',
      [postID, userID]
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//DISPLAY USERS WHO APPLIED TO A POST
export const getUsersWhoApplied = async (postID) => {
  try {
    const query = `
    SELECT u.id, u.username, u.bio, GROUP_CONCAT(us.skill) AS skills
    FROM user u
    JOIN post_applications pa ON u.id = pa.user_id
    JOIN users_skills us ON u.id = us.user_id
    WHERE pa.post_id = ?
    GROUP BY u.id, u.username, u.bio`;
    const [users] = await pool.query(query, [postID]);
    return users;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//DISPLAY USERS WHO GOT ACCEPTED TO A POST
export const getUsersWorkingOnPost = async (postID) => {
  try {
    const query = `
    SELECT u.id, u.username, u.bio, GROUP_CONCAT(us.skill) AS skills
    FROM (
      SELECT DISTINCT user_id
      FROM post_acceptances
      WHERE post_id = ?
    ) pa
    JOIN user u ON pa.user_id = u.id
    LEFT JOIN users_skills us ON u.id = us.user_id
    GROUP BY u.id, u.username, u.email, u.bio`;

    const [users] = await pool.query(query, [postID]);

    return users;
  } catch (error) {
    console.error('Failed to fetch users working on post:', error);
    throw new Error('Failed to fetch users working on post');
  }
};

//DISPLAY USERS WHO MATCH THE POST SKILLS (2 common skills)
export const comparePostSkills = async (postID) => {
  try {
    const query = `
    SELECT u.id, u.username, u.bio, GROUP_CONCAT(DISTINCT us.skill) AS user_skills
    FROM users_skills us
    JOIN user u ON us.user_id = u.id
    WHERE u.id IN (
      SELECT us.user_id
      FROM users_skills us
      JOIN posts_skills ps ON us.skill = ps.skill
      WHERE ps.post_id = ?
      GROUP BY us.user_id
      HAVING COUNT(DISTINCT ps.skill) >= 2
    )
    GROUP BY u.id, u.username, u.bio;`;

    const [matchedUsers] = await pool.query(query, [postID]);

    return matchedUsers;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
