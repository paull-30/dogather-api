import {
  getUsers,
  getUserByUsername,
  getUser,
} from '../services/user.queries.js';

import {
  createPost,
  getPost,
  getPosts,
  updatePostById,
  deletePostById,
  checkPostInvitation,
  createPostInvitation,
  checkPostApplication,
  createPostApplication,
  getUsersWhoApplied,
  getUsersWorkingOnPost,
  comparePostSkills,
} from '../services/post.queries.js';

import { v4 as uuidv4 } from 'uuid';
import { validatePostForUser } from '../services/validation.js';
import {
  updateSkills,
  acceptUsersApplications,
  rejectInvitation,
} from '../services/common.queries.js';

//GET ALL POSTS
export const getAllPosts = async (req, res) => {
  try {
    const posts = await getPosts();
    if (!posts || posts.length === 0) {
      return res.status(200).json({ message: 'No posts found!' });
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching the posts!' });
  }
};

//GET POST
export const getPostById = async (req, res) => {
  try {
    const postID = req.params.id;

    if (!postID) {
      return res
        .status(400)
        .json({ message: 'Please provide a valid post ID.' });
    }

    const post = await getPost(postID);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching the post.' });
  }
};

//CREATE POST
export const createNewPost = async (req, res) => {
  const userID = req.userId;
  const { title, description } = req.body;
  let searching_for_skills = req.body.searching_for_skills;

  if (!title || !description || searching_for_skills === undefined) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  const status = 'OPEN';
  const postId = uuidv4();

  try {
    const post = await createPost(
      postId,
      title,
      description,
      status,
      userID,
      searching_for_skills
    );
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating the post:', error);
    res.status(500).json({ message: 'Failed to create post!' });
  }
};

//UPDATE POST
export const updatePost = async (req, res) => {
  const postID = req.params.id;
  const userID = req.userId;

  const { title, description, status, searching_for_skills } = req.body;

  if (!title || !description || !searching_for_skills || !status) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }
  try {
    await validatePostForUser(postID, userID);
    await updatePostById(title, description, status, postID);
    if (searching_for_skills.length > 0) {
      await updateSkills(
        postID,
        searching_for_skills,
        'posts_skills',
        'post_id'
      );
    }
    res.status(200).json('Post updated succesfully.');
  } catch (error) {
    res.status(404).json({ message: `Failed to update post.${error}` });
  }
};

//DELETE POST
export const deletePost = async (req, res) => {
  const postID = req.params.id;
  const userID = req.userId;

  try {
    await validatePostForUser(postID, userID);
    await deletePostById(postID);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: `Failed to delete post.${error}` });
  }
};

//POST INVITATION
export const inviteUser = async (req, res) => {
  const postCreator = req.userId;
  const username = req.params.username;
  const postID = req.params.id;

  if (!username || !postID)
    return res.status(400).json({ message: 'Invalid request' });
  try {
    await validatePostForUser(postID, postCreator);
    const userID = await getUserByUsername(username);
    if (!userID) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isInvited = await checkPostInvitation(postID, userID);

    if (isInvited) {
      return res
        .status(400)
        .json({ message: 'User is already invited to this post' });
    }
    await createPostInvitation(postID, userID);
    res
      .status(201)
      .json({ message: `Invited user ${username} to post ${postID}` });
  } catch (error) {
    res.status(500).json({ message: `Failed to invite user to post.${error}` });
  }
};

//APPLY TO POST : USER PERSPECTIVE
export const applyToPost = async (req, res) => {
  const userID = req.userId;
  const postID = req.params.id;
  if (!userID || !postID) {
    return res.status(400).json({ message: 'Invalid request' });
  }
  try {
    const post = await getPost(postID);
    if (!post) return res.status(404).json({ message: 'Invalid post' });
    if (post.created_by === userID)
      return res
        .status(403)
        .json({ message: 'You are not allowed to apply to your own post!' });
    if (post.status !== 'OPEN') {
      return res
        .status(403)
        .json({ message: 'Post is not open for applications' });
    }

    const hasApplied = await checkPostApplication(postID, userID);
    if (hasApplied) {
      return res
        .status(400)
        .json({ message: 'You already applied to this post' });
    }
    await createPostApplication(postID, userID);
    res.status(201).json({ message: `You applied to post ${post.title}` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to apply to post' });
  }
};

//DISPLAY USERS WHO APPLIED
export const displayUsersWhoApplied = async (req, res) => {
  const creatorID = req.userId;
  const postID = req.params.id;

  try {
    const post = await getPost(postID);

    await validatePostForUser(postID, creatorID);
    const usersApplied = await getUsersWhoApplied(postID);
    res.status(200).json(usersApplied);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to display users who applied.${error}` });
  }
};

//ACCEPT USERS WHO APPLIED
export const acceptUserApplication = async (req, res) => {
  const postID = req.params.id;
  const creatorID = req.userId;
  const userID = req.params.userID;

  try {
    await validatePostForUser(postID, creatorID);
    const user = await getUser(userID);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await acceptUsersApplications(postID, userID, 'post_applications');
    res.status(200).json({ message: 'User application accepted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to accept user application.${error}` });
  }
};

//REJECT USERS WHO APPLIED
export const rejectUserApplication = async (req, res) => {
  const postID = req.params.id;
  const creatorID = req.userId;
  const userID = req.params.userID;
  try {
    await validatePostForUser(postID, creatorID);
    const user = await getUser(userID);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await rejectInvitation(postID, userID, 'post_applications');
    res.status(200).json({ message: 'User rejected successfully!' });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to reject user application.${error}` });
  }
};

//DISPLAY USERS WORKING ON A POST
export const displayUsersWorkingOnPost = async (req, res) => {
  const postID = req.params.id;
  const creatorID = req.userId;
  try {
    await validatePostForUser(postID, creatorID);

    const users = await getUsersWorkingOnPost(postID);

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users working on this post' });
    }

    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to fetch users working on post.${error}` });
  }
};

//DISPLAY RECOMMENDED USERS FOR A POST
export const displayUsersBasedOnSkills = async (req, res) => {
  const postID = req.params.id;
  const userID = req.userId;

  try {
    await validatePostForUser(postID, userID);
    const users = await comparePostSkills(postID);
    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: 'No users available matching post skills.' });
    }

    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to fetch users based on post skills.${error}` });
  }
};
