import {
  acceptUsersApplications,
  checkPostApplication,
  checkPostInvitation,
  createPostApplication,
  createPostInvitation,
  deletePostById,
  getPost,
  getPosts,
  getUser,
  getUserByUsername,
  getUsers,
  getUsersWhoApplied,
  getUsersWorkingOnPost,
  newPost,
  updatePostById,
} from '../database.js';

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
export const createPost = async (req, res) => {
  const userID = req.userId;
  const { title, description } = req.body;
  let searching_for_skills = req.body.searching_for_skills;

  if (!title || !description || searching_for_skills === undefined) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  const status = 'OPEN';
  searching_for_skills = JSON.stringify(searching_for_skills);

  try {
    const post = await newPost(
      title,
      description,
      searching_for_skills,
      status,
      userID
    );

    res.status(201).json({ post, message: 'Post created successfully.' });
  } catch (error) {
    console.error('Error creating the post:', error);
    res.status(500).json({ message: 'Failed to create post!' });
  }
};

//UPDATE POST
export const updatePost = async (req, res) => {
  const postID = req.params.id;
  const userID = req.userId;

  const { title, description, status } = req.body;
  const searching_for_skills = JSON.stringify(req.body.searching_for_skills);

  if (!title || !description || !searching_for_skills || !status) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }
  try {
    const user = await getUser(userID);
    const post = await getPost(postID);
    if (user.id !== post.created_by) {
      return res
        .status(403)
        .json({ message: 'You are not allowed to update this post.' });
    }
    await updatePostById(
      title,
      description,
      searching_for_skills,
      status,
      postID
    );
    res.status(200).json('Post updated succesfully.');
  } catch (error) {
    res.status(404).json({ message: 'Failed to update post' });
  }
};

//DELETE POST
export const deletePost = async (req, res) => {
  const postID = req.params.id;
  const userID = req.userId;

  if (!userID) return res.status(400).json({ message: 'Invalid user ID' });

  try {
    const user = await getUser(userID);
    const post = await getPost(postID);
    if (user.id !== post.created_by) {
      return res
        .status(403)
        .json({ message: 'You are not allowed to delete this post.' });
    }
    await deletePostById(postID);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post' });
  }
};

//POST INVITATION
export const inviteUser = async (req, res) => {
  const postCreator = req.userId;
  const username = req.params.username;
  const postID = Number(req.params.id);

  if (!username || !postID)
    return res.status(400).json({ message: 'Invalid request' });
  try {
    const post = await getPost(postID);
    if (!post || postCreator !== String(post.created_by)) {
      console.log(post.created_by);
      return res
        .status(403)
        .json({ message: 'You are not allowed to invite on this post' });
    }
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
    res.status(500).json({ message: 'Failed to invite user to post' });
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
    if (!post || post.status !== 'OPEN') {
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

    if (creatorID !== String(post.created_by))
      return res
        .status(403)
        .json({ message: 'You are not allowed to see these users' });
    const usersApplied = await getUsersWhoApplied(postID);
    res.status(200).json(usersApplied);
  } catch (error) {
    res.status(500).json({ message: 'Failed to display users who applied' });
  }
};

//ACCEPT USERS WHO APPLIED
export const acceptUserApplication = async (req, res) => {
  const postID = req.params.id;
  const creatorID = req.userId;
  const userID = req.params.userID;

  try {
    const post = await getPost(postID);

    if (creatorID !== String(post.created_by))
      return res
        .status(403)
        .json({ message: 'You are not allowed to accept users' });

    await acceptUsersApplications(postID, userID, 'post_applications');
    res.status(200).json({ message: 'User application accepted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to accept user application' });
  }
};

//DISPLAY USERS WORKING ON A POST
export const displayUsersWorkingOnPost = async (req, res) => {
  const postID = req.params.id;
  const creatorID = req.userId;
  try {
    const post = await getPost(postID);

    if (creatorID !== String(post.created_by))
      return res
        .status(403)
        .json({ message: 'You are not allowed to see users for this post!' });

    const users = await getUsersWorkingOnPost(postID);

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users working on this post' });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users working on post' });
  }
};

//DISPLAY RECOMMENDED USERS FOR A POST
export const displayUsersBasedOnSkills = async (req, res) => {
  const postID = req.params.id;
  try {
    const users = await getUsers();
    const post = await getPost(postID);

    const requiredSkills = post.searching_for_skills;

    const matchedUsers = users.filter((user) => {
      if (user.skills && post.created_by !== user.id) {
        const matchingSkills = user.skills.filter((skill) =>
          requiredSkills.includes(skill)
        );
        return matchingSkills.length >= 2;
      }
      return false;
    });
    if (matchedUsers.length === 0) {
      return res
        .status(404)
        .json({ message: 'No users available with the required skills.' });
    }
    res.status(200).json(matchedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users based on skills' });
  }
};
