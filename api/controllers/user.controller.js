import { getUser, getUsers } from '../database.js';

//GET USERS
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
//GET USER BY ID

//UPDATE USER BY ID

//DELETE USER BY ID
