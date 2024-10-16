const BASE_API_URL = "https://v2.api.noroff.dev";

// Function to get the blog name (from localStorage or sessionStorage)
function getBlogName() {
  const blogName = localStorage.getItem("blogName");
  if (!blogName) {
    console.error("Blog name not found. User might not be logged in.");
    return null;
  }
  return blogName;
}

export const REGISTER_API_ENDPOINT = `${BASE_API_URL}/auth/register`;
export const LOGIN_API_ENDPOINT = `${BASE_API_URL}/auth/login`;

export const BLOG_POSTS_API_ENDPOINT = () =>
  `${BASE_API_URL}/blog/posts/${getBlogName()}`;

export const GET_POST_API_ENDPOINT = (postId) =>
  `${BASE_API_URL}/blog/posts/${getBlogName()}/${postId}`;

export const UPDATE_POST_API_ENDPOINT = (postId) =>
  `${BASE_API_URL}/blog/posts/${getBlogName()}/${postId}`;

export const DELETE_POST_API_ENDPOINT = (postId) =>
  `${BASE_API_URL}/blog/posts/${getBlogName()}/${postId}`;
