import pool from '../services/db.js';

//UPDATE SKILLS (USER OR POST)
export const updateSkills = async (id, skills, table, searchBy) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    await connection.query(`DELETE FROM ${table} WHERE ${searchBy} = ?`, [id]);

    const skillValues = skills.map((skill) => [id, skill]);
    const insertQuery = `INSERT INTO ${table} (${searchBy}, skill) VALUES ?`;
    await connection.query(insertQuery, [skillValues]);

    await connection.commit();

    return { success: true };
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Failed to update skills:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
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

export const rejectInvitation = async (postID, userID, table) => {
  try {
    await pool.query(
      `UPDATE ${table} SET status = "rejected" WHERE user_id = ? AND post_id = ?`,
      [userID, postID]
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};
