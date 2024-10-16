import { getAccessToken } from "./accesstoken.mjs";
import { BLOG_POSTS_API_ENDPOINT } from "./api.mjs";
import { updateLocalStoragePost } from "./postutils.mjs";
import { showToast } from "./toast.mjs";

// blogposts create, update, fetching, post edit

// Create a new blog post
export async function createBlogPost(blogPost) {
  try {
    const accessToken = getAccessToken();
    const options = {
      method: "POST",
      body: JSON.stringify(blogPost),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await fetch(BLOG_POSTS_API_ENDPOINT(), options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    console.log("Blog post created successfully:", json);
    let savedPosts = JSON.parse(localStorage.getItem("blogPosts")) || {
      data: [],
    };

    if (Array.isArray(savedPosts.data)) {
      savedPosts.data.unshift(json.data);
      const postId = json.data.id;
      localStorage.setItem("blogPosts", JSON.stringify(savedPosts));
    } else {
      console.error(
        "Expected savedPosts.data to be an array but got:",
        savedPosts.data
      );
    }
  } catch (error) {
    console.error("Failed to create blog post:", error);
    showToast("Failed to create blog post. Please try again.", "error");
  }
}

// Update an existing blog post
export async function updateBlogPost(postId, updatedPost) {
  try {
    const accessToken = getAccessToken();
    const options = {
      method: "PUT",
      body: JSON.stringify(updatedPost),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await fetch(
      `${BLOG_POSTS_API_ENDPOINT()}/${postId}`,
      options
    );

    if (!response.ok) {
      throw new Error(`Failed to update post: ${response.statusText}`);
    }

    const json = await response.json();
    updateLocalStoragePost(postId, json.data);
    console.log(`Post with ID ${postId} updated successfully.`);
  } catch (error) {
    console.error("Error updating post:", error);
  }
}

// Fetch a single blog post by ID
export async function getBlogPostById(postId) {
  try {
    const response = await fetch(`${BLOG_POSTS_API_ENDPOINT()}/${postId}`);
    if (!response.ok) throw new Error("Failed to fetch blog post");
    const post = await response.json();
    return post.data;
  } catch (error) {
    console.error("Error fetching blog post:", error);
  }
}
