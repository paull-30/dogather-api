import pool from './db.js';

//CHECK IF USER IS PART OF A POST
export const isUserAcceptedInPost = async (userID, postID) => {
  try {
    const [isUser] = await pool.query(
      `SELECT * FROM post_acceptances WHERE user_id = ? AND post_id = ?`,
      [userID, postID]
    );
    return isUser.length > 0;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//DISPLAY TASKS OF A POST
export const getTasksForPost = async (postID) => {
  try {
    const [tasks] = await pool.query(`SELECT * FROM task WHERE post_id = ?`, [
      postID,
    ]);
    return tasks;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//DISPLAY A TASK BY ID
export const getTaskById = async (postID, taskID) => {
  try {
    const [task] = await pool.query(
      `SELECT * FROM task WHERE post_id = ? AND id = ?`,
      [postID, taskID]
    );
    return task[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//CREATE A TASK
export const newTask = async (
  id,
  title,
  description,
  status,
  created_by,
  deadline,
  assigned,
  postID
) => {
  try {
    await pool.query(
      'INSERT INTO task (id,title,description,status,created_by,deadline,assigned_user_id,post_id) VALUES (?,?,?,?,?,?,?,?)',
      [id, title, description, status, created_by, deadline, assigned, postID]
    );
    return { message: 'Task created successfully' };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//UPDATE TASK
export const updateTaskById = async (
  taskID,
  title,
  description,
  status,
  deadline,
  assigned
) => {
  try {
    await pool.query(
      'UPDATE task SET title = ?,description = ?,status = ?, deadline = ?, assigned_user_id = ? WHERE id = ?',
      [title, description, status, deadline, assigned, taskID]
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//UPDATE TASK STATUS
export const updateStatus = async (taskID, status) => {
  try {
    await pool.query('UPDATE task SET status = ? WHERE id = ?', [
      status,
      taskID,
    ]);
    return { message: 'Task status changed successfully' };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//DELETE TASK
export const deleteTaskById = async (taskID, postID) => {
  try {
    await pool.query('DELETE FROM task WHERE id = ? and post_id = ?', [
      taskID,
      postID,
    ]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
