import pool from './db.js';

//CHECK USERNAME IF ALREADY EXISTS
export const checkUsername = async (username) => {
  try {
    const [usernames] = await pool.query(
      'SELECT * FROM user WHERE username = ?',
      [username]
    );
    return usernames[0];
  } catch (error) {
    throw error;
  }
};

//GET USER SKILLS
export const getSkills = async (id) => {
  try {
    const [skills] = await pool.query(
      'SELECT GROUP_CONCAT(skill) AS skills FROM users_skills WHERE user_id = ?',
      [id]
    );
    return skills[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//CHECK EMAIL IF ALREADY EXISTS
export const checkEmail = async (email) => {
  try {
    const [emails] = await pool.query('SELECT * FROM user WHERE email = ?', [
      email,
    ]);
    return emails[0];
  } catch (error) {
    throw error;
  }
};

//CREATE USER
export const createUser = async (id, username, email, hPassword, role) => {
  try {
    await pool.query(
      'INSERT INTO user (id,username, email, password, role) VALUES (?,?,?,?,?)',
      [id, username, email, hPassword, role]
    );
  } catch (error) {
    throw error;
  }
};

//GET USER DATA
export const getUser = async (id) => {
  try {
    const [user] = await pool.query(
      'SELECT u.id, u.username, u.email, u.role, u.bio, GROUP_CONCAT(us.skill) AS skills FROM user u LEFT JOIN users_skills us ON u.id = us.user_id WHERE u.id = ? GROUP BY u.id',
      [id]
    );
    return user[0];
  } catch (error) {
    throw error;
  }
};

//UPDATE USER DATA WITHOUT SKILLS
export const updateUserInfo = async (id, fieldsToUpdate) => {
  try {
    const setClause = Object.keys(fieldsToUpdate)
      .map((key) => `${key} = ?`)
      .join(', ');
    const values = [...Object.values(fieldsToUpdate), id];

    const [result] = await pool.query(
      `UPDATE user SET ${setClause} WHERE id = ?`,
      values
    );

    return result;
  } catch (error) {
    console.error('Failed to update user info:', error);
    throw new Error('Failed to update user info');
  }
};

//UPDATE USER SKILLS
export const updateUserSkills = async (userId, skills) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    await connection.query('DELETE FROM users_skills WHERE user_id = ?', [
      userId,
    ]);

    const skillValues = skills.map((skill) => [userId, skill]);
    const insertQuery = 'INSERT INTO users_skills (user_id, skill) VALUES ?';
    await connection.query(insertQuery, [skillValues]);

    await connection.commit();

    return { success: true };
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Failed to update user skills:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

//DELETE USER
export const deleteUserByID = async (id) => {
  try {
    await pool.query('DELETE FROM user WHERE id = ?', [id]);
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw error;
  }
};

//DISPLAY INVITATIONS TO A POST
export const getInvitations = async (id) => {
  try {
    const query = `
    SELECT p.id, p.title, p.description, pi.status AS invitation_status, p.status AS post_status, p.created_at, p.created_by, ps.skill AS searching_for_skills
    FROM post_invitations pi
    INNER JOIN post p ON pi.post_id = p.id
    LEFT JOIN posts_skills ps ON p.id = ps.post_id
    WHERE pi.user_id = ?
    `;
    const [invitedPosts] = await pool.query(query, [id]);
    return invitedPosts;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//CHECK IF USER IS ALREADY ACCEPTED IN A POST
export const isUserAccepted = async (postID, userID) => {
  try {
    const query =
      'SELECT COUNT(*) AS count FROM post_acceptances WHERE post_id = ? AND user_id = ?';
    const [result] = await pool.query(query, [postID, userID]);
    return result[0].count > 0;
  } catch (error) {
    console.error('Failed to see if user is accepted');
    throw error;
  }
};

//UPDATE INVITATION STATUS
const updateUserApplicationStatus = async (
  connection,
  postID,
  userID,
  table
) => {
  const query = `UPDATE ${table} SET status = ? WHERE post_id = ? AND user_id = ?`;
  await connection.query(query, ['accepted', postID, userID]);
};

//INSERT USER TO POST WORKING AREA (post_acceptances)
const addUserAcceptance = async (connection, postID, userID) => {
  const query = `INSERT INTO post_acceptances (post_id, user_id) VALUES (?, ?)`;
  await connection.query(query, [postID, userID]);
};

//ACCEPT POST INVITATION
export const acceptUsersApplications = async (postID, userID, table) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    await updateUserApplicationStatus(connection, postID, userID, table);
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
};

//DISPLAY USER JOINED POSTS
export async function getPostsWhichUserJoined(id) {
  try {
    const query = `
    SELECT p.id, p.title, p.description, p.status
    FROM post_acceptances pa
    INNER JOIN post p ON pa.post_id = p.id
    WHERE pa.user_id = ?
  `;
    const [acceptedPosts] = await pool.query(query, [id]);
    return acceptedPosts;
  } catch (error) {
    console.error('Failed to get posts!');
    throw error;
  }
}

//COMPARE USER SKILLS
export const compareUserSkills = async (skills) => {
  try {
    const skillsArray = skills.split(',');

    const placeholders = skillsArray.map(() => '?').join(',');

    const query = `
        SELECT p.id, p.title, p.description,p.status,p.created_at, GROUP_CONCAT(ps.skill) AS post_skills
        FROM posts_skills ps
        JOIN post p ON ps.post_id = p.id
        WHERE ps.skill IN (${placeholders})
        GROUP BY p.id
        HAVING COUNT(DISTINCT ps.skill) >= 2
      `;

    const [matchedPosts] = await pool.query(query, skillsArray);

    return matchedPosts;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
