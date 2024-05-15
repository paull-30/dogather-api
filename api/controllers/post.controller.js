import {
  deletePostById,
  getPost,
  getPosts,
  getUser,
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
        .json({ message: 'You are not allowed to update this post.' });
    }
    await deletePostById(postID);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post' });
  }
};
