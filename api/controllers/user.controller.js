import {
  acceptUsersApplications,
  checkUsername,
  deleteUserByID,
  getInvitations,
  getPosts,
  getPostsWhichUserJoined,
  getUser,
  getUsers,
  updateUserInfo,
} from '../database.js';
import bcrypt from 'bcrypt';

//ADMIN ROUTE : GET ALL USERS
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

//UPDATE USER
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

//DELETE USER
export const deleteUser = async (req, res) => {
  const userId = req.params.userID;

  const userID = req.userId;

  if (!userID) return res.status(400).json({ message: 'Invalid user ID' });

  if (userId !== userID)
    return res
      .status(403)
      .json({ message: 'You are not authorized for this ID!' });
  try {
    await deleteUserByID(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

//ACCEPT A POST INVITATION
export const acceptPost = async (req, res) => {
  const userID = req.userId;
  const postID = req.params.postId;
  console.log(userID);
  console.log(postID);
  try {
    await acceptUsersApplications(postID, userID, 'post_invitations');
    res.status(200).json({ message: 'Post accepted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to accept post invitation!' });
  }
};

//DISPLAY ALL INVITATIONS
export const displayInvitations = async (req, res) => {
  const userId = req.userId;
  try {
    const invitations = await getInvitations(userId);
    if (invitations.length === 0) {
      return res.status(404).json({ message: 'No invitations found.' });
    }
    res.status(200).json(invitations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch invitations' });
  }
};

//DISPLAY POSTS THAT USER IS WORKING ON
export const getAcceptedPosts = async (req, res) => {
  const userID = req.userId;
  try {
    const posts = await getPostsWhichUserJoined(userID);
    if (posts.length === 0) {
      return res
        .status(200)
        .json({ message: 'User was not accepted to a post!' });
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch accepted posts' });
  }
};

//DISPLAY POSTS THAT USER HAS SKILLS REQUIRED
export const displayPostsBasedOnUserSkills = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await getUser(userId);
    const posts = await getPosts();

    const userSkills = user.skills;

    const matchedPosts = posts.filter((post) => {
      if (post.searching_for_skills && String(post.created_by) !== userId) {
        const requiredSkills = post.searching_for_skills;
        const matchingSkills = requiredSkills.filter((skill) =>
          userSkills.includes(skill)
        );
        return matchingSkills.length >= 2;
      }
      return false;
    });

    if (matchedPosts.length === 0) {
      return res
        .status(404)
        .json({ message: 'No posts available matching your skills.' });
    }

    res.status(200).json(matchedPosts);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch posts based on user skills' });
  }
};
