import { getPost } from './post.queries.js';

export const validatePostForUser = async (postID, userID) => {
  const post = await getPost(postID);
  if (!post) throw new Error('Invalid post');
  if (userID !== post.created_by) {
    throw new Error('You are not allowed to make changes on this post.');
  }
};
