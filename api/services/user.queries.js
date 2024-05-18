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

//GET USER BY USERNAME
export const getUserByUsername = async (username) => {
  try {
    const [user] = await pool.query('SELECT id FROM user WHERE username = ?', [
      username,
    ]);
    return user[0]?.id;
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

//GET INVITATIONS FROM A POST (CHECK IF USER WHO REQUESTED HAS THE INVITATION)
export const getPostInvitation = async (postID, userID) => {
  try {
    const query = `
      SELECT *
      FROM post_invitations
      WHERE post_id = ? AND user_id = ?
    `;
    const [invitation] = await pool.query(query, [postID, userID]);

    return invitation[0];
  } catch (error) {
    console.error('Failed to get post invitation:', error);
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

//ADMIN GET USERS
export async function getUsers() {
  const query = `
    SELECT u.id, u.username, u.email, u.bio, u.role, GROUP_CONCAT(us.skill) AS skills
    FROM user u
    LEFT JOIN users_skills us ON u.id = us.user_id
    GROUP BY u.id;
  `;
  const [users] = await pool.query(query);
  return users;
}
