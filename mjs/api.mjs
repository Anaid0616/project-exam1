export const BASE_API_URL = "https://v2.api.noroff.dev";

// Function to get the blog name (from localStorage or sessionStorage)
// Fallback to "diana_bergelin" if no blog name is retrieved
export function getBlogName() {
  const blogName = localStorage.getItem("blogName");
  console.log("Blog name being used:", blogName || "diana_bergelin");
  return blogName ? blogName : "diana_bergelin"; // Default to "diana_bergelin"
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
