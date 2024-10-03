import { BLOG_POSTS_API_ENDPOINT } from "./api.mjs";
import { showLoader, hideLoader } from "./loader.mjs";
import { showToast } from "./toast.mjs";
import { getAccessToken } from "./accesstoken.mjs";
import {
  UPDATE_POST_API_ENDPOINT,
  DELETE_POST_API_ENDPOINT,
  GET_POST_API_ENDPOINT,
} from "./api.mjs";
import {
  removePostFromLocalStorage,
  updateLocalStoragePost,
} from "./postutils.mjs";
import { setupNavbar } from "./navbar.mjs"; // Import the navbar setup function

// Set up the navbar for login/logout behavior
setupNavbar();

// Helper to get query parameters (like the post ID from URL)
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Fetch a single blog post by ID
async function getBlogPostById(postId) {
  showLoader();
  try {
    const response = await fetch(`${BLOG_POSTS_API_ENDPOINT}/${postId}`);
    if (!response.ok) {
      console.error(`Failed to fetch blog post. Status: ${response.status}`);
      return null;
    }
    const post = await response.json();
    return post.data;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  } finally {
    hideLoader();
  }
}

// Display the blog post on the page
function displayBlogPost(post) {
  if (!post) return;

  document.getElementById("post-title").innerText = post.title;

  // Display the author
  let authorName = post.author?.name || "Unknown Author";
  document.getElementById("post-author").innerText = authorName;

  // Display the publication date
  let publishedDate = "Unknown Date";
  if (post.created) {
    publishedDate = new Date(post.created).toLocaleDateString();
  } else if (post.updated) {
    publishedDate = new Date(post.updated).toLocaleDateString();
  }
  document.getElementById("post-date").innerText = publishedDate;

  // Display the image
  document.getElementById("post-image").src =
    post.media?.url || "default-image.jpg";
  document.getElementById("post-image").alt = post.media?.alt || "Blog image";

  // Display the body/content
  document.getElementById("post-body").innerText = post.body;
}
// Set up event listeners for buttons
function setupButtons(post) {
  const editButton = document.getElementById("edit-button");
  const deleteButton = document.getElementById("delete-button");

  if (editButton) {
    editButton.addEventListener("click", function (event) {
      event.preventDefault();
      window.location.href = `/post/edit.html?id=${post.id}`; // Redirect to the edit page with the post ID
    });
  } else {
    console.error("Edit button not found or not configured correctly.");
  }

  if (deleteButton) {
    deleteButton.addEventListener("click", function (event) {
      event.preventDefault();

      const modal = document.getElementById("deleteModal");
      if (modal) {
        modal.style.display = "block"; // Show the modal

        // Now set up the modal buttons after it's shown
        const confirmDeleteButton = document.getElementById("confirmDelete");
        const cancelDeleteButton = document.getElementById("cancelDelete");
        const closeModalButton = document.querySelector(".close");

        // Ensure these buttons exist inside the modal before attaching listeners
        if (confirmDeleteButton) {
          confirmDeleteButton.addEventListener("click", async function () {
            await deleteBlogPost(post.id);
            modal.style.display = "none"; // Hide the modal after deletion
            setTimeout(() => {
              window.location.href = "/index.html";
            }, 1500); // 1.5 seconds delay
          });
        } else {
          console.error("Confirm Delete button not found.");
        }

        if (cancelDeleteButton) {
          cancelDeleteButton.addEventListener("click", function () {
            modal.style.display = "none"; // Close the modal when cancel is clicked
          });
        } else {
          console.error("Cancel Delete button not found.");
        }

        if (closeModalButton) {
          closeModalButton.addEventListener("click", function () {
            modal.style.display = "none"; // Close the modal when X is clicked
          });
        } else {
          console.error("Close Modal button not found.");
        }

        // Optional: Close the modal if the user clicks outside of the modal
        window.addEventListener("click", function (event) {
          if (event.target === modal) {
            modal.style.display = "none";
          }
        });
      }
    });
  } else {
    console.error("Delete button not found or not configured correctly.");
  }
}

async function deleteBlogPost(postId) {
  try {
    const response = await fetch(DELETE_POST_API_ENDPOINT(postId), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`, // Ensure user is authenticated
      },
    });
    if (!response.ok)
      throw new Error(`Failed to delete post: ${response.statusText}`);

    // Remove the post from local storage
    removePostFromLocalStorage(postId);

    // Remove the post from the DOM
    const postElement = document.getElementById(`post-${postId}`);
    if (postElement) {
      postElement.remove();
    }

    // Show success toast notification
    showToast("Post deleted successfully!", "success");

    // Redirect to the main blog feed after a short delay to allow the toast to display
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 1500); // 1.5 seconds delay
  } catch (error) {
    console.error("Error deleting post:", error);

    // Show error toast notification
    showToast("Failed to delete post. Please try again.", "error");
  }
}

// Function to update a blog post by ID
async function updateBlogPost(postId, updatedPost) {
  try {
    const response = await fetch(UPDATE_POST_API_ENDPOINT(postId), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`, // Ensure user is authenticated
      },
      body: JSON.stringify(updatedPost),
    });
    if (!response.ok) throw new Error("Failed to update post");
    const updatedData = await response.json();
    console.log(`Post with ID ${postId} updated successfully.`, updatedData);

    // Update local storage
    updateLocalStoragePost(postId, updatedData);

    return updatedData;
  } catch (error) {
    console.error("Error updating post:", error);
  }
}

// Function to show or hide buttons based on login status
function manageButtonVisibility() {
  const isLoggedIn = !!getAccessToken(); // Check if the user is logged in by checking for a valid token

  const createButton = document.getElementById("create-button"); // Create button
  const editButton = document.getElementById("edit-button"); // Edit button
  const deleteButton = document.getElementById("delete-button"); // Delete button

  if (isLoggedIn) {
    if (createButton) createButton.style.display = "block";
    if (editButton) editButton.style.display = "block";
    if (deleteButton) deleteButton.style.display = "block";
  } else {
    if (createButton) createButton.style.display = "none";
    if (editButton) editButton.style.display = "none";
    if (deleteButton) deleteButton.style.display = "none";
  }
}

// Main function to run when the page loads
async function main() {
  const postId = getQueryParam("id");

  if (!postId) {
    console.error("No blog post ID found in the URL.");
    return;
  }

  const blogPost = await getBlogPostById(postId);

  if (blogPost) {
    displayBlogPost(blogPost);
    setupButtons(blogPost);

    // Show the content container once the data is loaded
    document.getElementById("content").style.display = "block";
  }

  // Call the function to manage button visibility based on login status
  manageButtonVisibility();
}

main();
