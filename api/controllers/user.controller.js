import {
  checkUsername,
  deleteUserByID,
  getUser,
  getUsers,
  updateUserInfo,
} from '../database.js';
import bcrypt from 'bcrypt';

export const getAllUsers = async (req, res) => {
  const userID = req.userId;
  if (!userID) return res.status(400).json({ message: 'Invalid user ID' });
  try {
    const user = await getUser(userID);
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.role !== 'ADMIN')
      return res.status(403).json({ message: 'You are not authorized!' });
    const users = await getUsers();
    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users!' });
  }
};

export const updateUser = async (req, res) => {
  const { username, email, bio, role, skills, password } = req.body;
  const userId = req.params.userID;

  const userID = req.userId;

  if (!userID) return res.status(400).json({ message: 'Invalid user ID' });

  if (userId !== userID)
    return res
      .status(403)
      .json({ message: 'You are not authorized for this ID!' });

  if (role && !['VOLUNTEER', 'ORGANIZER'].includes(role)) {
    return res.status(400).json({
      message: 'Invalid role. Only volunteer or organizer roles are allowed.',
    });
  }

  try {
    const fieldsToUpdate = {};
    if (username) {
      const existingUser = await checkUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: 'Username already taken' });
      }
      fieldsToUpdate.username = username;
    }
    if (email) fieldsToUpdate.email = email;
    if (bio) fieldsToUpdate.bio = bio;
    if (role) fieldsToUpdate.role = role;
    if (skills) fieldsToUpdate.skills = JSON.stringify([...skills]);
    if (password) {
      fieldsToUpdate.password = await bcrypt.hash(password, 10);
    }

    const result = await updateUserInfo(userID, fieldsToUpdate);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const user = await getUser(userID);
    console.log(user);
    const { password: userPassword, ...userInfo } = user;

    res.status(200).json(userInfo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user!' });
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.params.userID;

  const userID = req.userId;

  if (!userID) return res.status(400).json({ message: 'Invalid user ID' });

  if (userId !== userID)
    return res
      .status(403)
      .json({ message: 'You are not authorized for this ID!' });

  await deleteUserByID(userId);
  res.status(200).json({ message: 'User deleted successfully' });
};
