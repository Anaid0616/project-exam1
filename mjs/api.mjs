const BASE_API_URL = "https://v2.api.noroff.dev";

export const REGISTER_API_ENDPOINT = `${BASE_API_URL}/auth/register`;
export const LOGIN_API_ENDPOINT = `${BASE_API_URL}/auth/login`;

const REGISTERED_BLOG_NAME = "diana_bergelin";

export const BLOG_POSTS_API_ENDPOINT = `${BASE_API_URL}/blog/posts/${REGISTERED_BLOG_NAME}`;

// Blog post-specific endpoints (to use with post ID)
export const GET_POST_API_ENDPOINT = (postId) =>
  `${BASE_API_URL}/blog/posts/${REGISTERED_BLOG_NAME}/${postId}`;

export const UPDATE_POST_API_ENDPOINT = (postId) =>
  `${BASE_API_URL}/blog/posts/${REGISTERED_BLOG_NAME}/${postId}`;

export const DELETE_POST_API_ENDPOINT = (postId) =>
  `${BASE_API_URL}/blog/posts/${REGISTERED_BLOG_NAME}/${postId}`;
