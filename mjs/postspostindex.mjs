//get, updating and deleting in postindex
import {
  GET_POST_API_ENDPOINT,
  DELETE_POST_API_ENDPOINT,
  UPDATE_POST_API_ENDPOINT,
} from "./api.mjs";
import { getAccessToken } from "./accesstoken.mjs";

export async function getBlogPostById(postId) {
  const url = GET_POST_API_ENDPOINT(postId);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch blog post. Status: ${response.status}`);
    }
    const post = await response.json();
    return post.data;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

export async function deleteBlogPost(postId) {
  try {
    const response = await fetch(DELETE_POST_API_ENDPOINT(postId), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });

    if (!response.ok)
      throw new Error(`Failed to delete post: ${response.statusText}`);
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    return false;
  }
}

export async function updateBlogPost(postId, updatedPost) {
  try {
    const response = await fetch(UPDATE_POST_API_ENDPOINT(postId), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
      },
      body: JSON.stringify(updatedPost),
    });

    if (!response.ok) throw new Error("Failed to update post");
    const updatedData = await response.json();
    return updatedData;
  } catch (error) {
    console.error("Error updating post:", error);
    return null;
  }
}
