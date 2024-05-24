import { v4 as uuidv4 } from 'uuid';
import {
  deleteTaskById,
  getTaskById,
  getTasksForPost,
  isUserAcceptedInPost,
  newTask,
  updateStatus,
  updateTaskById,
} from '../services/task.queries.js';
import { validatePostForUser } from '../services/validation.js';

//DISPLAY ALL TASKS
export const displayTasks = async (req, res) => {
  const userID = req.userId;
  const postID = req.params.id;

  try {
    const isAccepted = await isUserAcceptedInPost(userID, postID);

    if (!isAccepted) {
      return res.status(403).json({
        message: 'You are not authorized to view the tasks for this post.',
      });
    }

    const tasks = await getTasksForPost(postID);

    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'An error occurred while fetching tasks.' });
  }
};

//DISPLAY A TASK
export const getTask = async (req, res) => {
  const userID = req.userId;
  const postID = req.params.id;
  const taskID = req.params.taskId;

  try {
    const isAccepted = await isUserAcceptedInPost(userID, postID);

    if (!isAccepted) {
      return res.status(403).json({
        message: 'You are not authorized to view the tasks for this post.',
      });
    }
    const task = await getTaskById(postID, taskID);
    res.status(200).json(task);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'An error occurred while fetching the task.' });
  }
};

//CREATE TASK
export const createTask = async (req, res) => {
  const { title, description, deadline, assigned } = req.body;
  const userID = req.userId;
  const postID = req.params.id;

  const defaultTitle = title || 'Untitled Task';
  const defaultDescription = description || 'No description provided';
  const defaultDeadline = deadline || null;
  const defaultAssigned = assigned || null;

  try {
    await validatePostForUser(postID, userID);
    const id = uuidv4();
    const status = 'not_started';
    const created_by = userID;
    const task = await newTask(
      id,
      defaultTitle,
      defaultDescription,
      status,
      created_by,
      defaultDeadline,
      defaultAssigned,
      postID
    );
    res.status(200).json(task);
  } catch (error) {
    res
      .status(500)
      .json({ message: `An error occurred while creating the task.${error}` });
  }
};

//UPDATE TASK
export const updateTask = async (req, res) => {
  const { title, description, status, deadline, assigned } = req.body;
  const postID = req.params.id;
  const taskId = req.params.taskId;
  const userID = req.userId;

  try {
    await validatePostForUser(postID, userID);
    const existingTask = await getTaskById(postID, taskId);

    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    await updateTaskById(
      taskId,
      title,
      description,
      status,
      deadline,
      assigned
    );

    const updatedTask = await getTaskById(postID, taskId);

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res
      .status(500)
      .json({ message: 'An error occurred while updating the task.' });
  }
};

//UPDATE TASK STATUS (ALLOWED ONLY FOR POST CREATOR AND ASSIGNED USER)
export const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  const postID = req.params.id;
  const taskId = req.params.taskId;
  const userID = req.userId;

  try {
    const task = await getTaskById(postID, taskId);
    const isCreator = userID === task.created_by;
    const isAssignedUser = task.assigned_user_id
      ? userID === task.assigned_user_id
      : false;

    if (!isCreator && !isAssignedUser) {
      return res
        .status(404)
        .json({ message: 'You are not allowed to update status!' });
    }
    await updateStatus(taskId, status);
    res.status(200).json({ message: 'Task status updated successfully.' });
  } catch (error) {
    res.status(500).json({
      message: `An error occurred while updating the status.${error}`,
    });
  }
};

//DELETE TASK
export const deleteTask = async (req, res) => {
  const postID = req.params.id;
  const taskId = req.params.taskId;
  const userID = req.userId;

  try {
    await validatePostForUser(postID, userID);
    const task = await getTaskById(postID, taskId);
    if (!task) return res.status(404).json({ message: 'Task not found!' });
    await deleteTaskById(taskId, postID);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: `An error occurred while deleting the task.${error}`,
    });
  }
};
