import { getAccessToken } from "./accesstoken.mjs";
import { BLOG_POSTS_API_ENDPOINT } from "./api.mjs";
import { setupNavbar } from "./navbar.mjs"; // Import the navbar setup function
import { showToast } from "./toast.mjs"; // Ensure this is at the top of your file
import { updateLocalStoragePost } from "./postutils.mjs";

// Set up the navbar for login/logout behavior
setupNavbar();

// Helper to get query parameters
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

document.addEventListener("DOMContentLoaded", async function () {
  const postId = getQueryParam("id");

  if (postId) {
    // If there's an ID in the URL, we're editing an existing post
    const post = await getBlogPostById(postId);
    populateEditForm(post); // Populate the form with existing data for editing
  }

  const createOrEditForm = document.querySelector(".edit-blog-post");
  if (createOrEditForm) {
    createOrEditForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const blogPost = {
        title: document.querySelector("#title-input").value,
        media: {
          url: document.querySelector("#img-input").value,
          alt: document.querySelector("#alt-input").value,
        },
        body: document.querySelector("#body-input").value,
        tags: document.querySelector("#tags-input").value.split(" "),
      };

      // Validate the image URL format
      if (!isValidImageUrl(blogPost.media.url)) {
        showToast(
          "Please enter a valid image URL with .jpg, .jpeg, .gif, or .png extension.",
          "error"
        );
        return; // Stop the form submission
      }

      // Try to load the image to check if it's valid
      validateImageUrl(
        blogPost.media.url,
        async function () {
          try {
            if (postId) {
              // Updating an existing post
              await updateBlogPost(postId, blogPost);
              showToast("Post updated successfully!");
              setTimeout(() => {
                window.location.href = `../post/index.html?id=${postId}`; // Redirect after 3 seconds
              }, 1800);
            } else {
              // Creating a new post
              await createBlogPost(blogPost);
              showToast("Post created successfully!");
              clearForm(); // Clear the form
              setTimeout(() => {
                window.location.href = "./index.html"; // Redirect after 3 seconds
              }, 1800);
            }
          } catch (error) {
            console.error("Error during form submission:", error);
            showToast("An error occurred. Please try again.");
          }
        },
        function () {
          // If the image is invalid, show an error message
          showToast(
            "The image URL is invalid. Please provide a valid image link.",
            "error"
          );
        }
      );
    });
  }
});

// Helper functions
function isValidImageUrl(url) {
  return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
}

function validateImageUrl(url, onSuccess, onError) {
  const img = new Image();
  img.onload = onSuccess;
  img.onerror = onError;
  img.src = url; // Set the image URL to be loaded
}

//clear form after save
function clearForm() {
  document.querySelector("#title-input").value = "";
  document.querySelector("#img-input").value = "";
  document.querySelector("#alt-input").value = "";
  document.querySelector("#body-input").value = "";
  document.querySelector("#tags-input").value = "";
}

// Populate form for editing
function populateEditForm(post) {
  document.querySelector("#title-input").value = post.title;
  document.querySelector("#img-input").value = post.media?.url || "";
  document.querySelector("#alt-input").value = post.media?.alt || "";
  document.querySelector("#body-input").value = post.body;
  document.querySelector("#tags-input").value = post.tags.join(" ");
}

// Create a new blog post
async function createBlogPost(blogPost) {
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

    const response = await fetch(BLOG_POSTS_API_ENDPOINT, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    // handle the localStorage updates
    let savedPosts = JSON.parse(localStorage.getItem("blogPosts")) || {
      data: [],
    };

    // Make sure savedPosts.data exists and is an array
    if (Array.isArray(savedPosts.data)) {
      savedPosts.data.unshift(json.data); // Add the new post to the beginning of the array
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
// Function to fetch a blog post by ID
async function getBlogPostById(postId) {
  try {
    const response = await fetch(`${BLOG_POSTS_API_ENDPOINT}/${postId}`);
    if (!response.ok) throw new Error("Failed to fetch blog post");
    const post = await response.json();
    return post.data;
  } catch (error) {
    console.error("Error fetching blog post:", error);
  }
}

// Update an existing blog post
async function updateBlogPost(postId, updatedPost) {
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
      `${BLOG_POSTS_API_ENDPOINT}/${postId}`,
      options
    );
    if (!response.ok) {
      throw new Error(`Failed to update post: ${response.statusText}`);
    }

    const json = await response.json();
    // Update the post in localStorage
    updateLocalStoragePost(postId, json.data);

    console.log(`Post with ID ${postId} updated successfully.`);
  } catch (error) {
    console.error("Error updating post:", error);
  }
}

// After editing a post
async function handleEditBlogPost(postId, updatedPost) {
  const savedPosts = JSON.parse(localStorage.getItem("blogPosts")) || [];
  const updatedPosts = savedPosts.map((post) =>
    post.data.id === postId ? { data: updatedData } : post
  );
  localStorage.setItem("blogPosts", JSON.stringify(updatedPosts));

  window.location.href = "./index.html";
}

// After deleting a post
async function handleDeleteBlogPost(postId) {
  // Update localStorage to remove the deleted post
  const savedPosts = JSON.parse(localStorage.getItem("blogPosts")) || [];
  const remainingPosts = savedPosts.filter((post) => post.data.id !== postId);
  localStorage.setItem("blogPosts", JSON.stringify(remainingPosts));

  window.location.href = "./index.html";
}
