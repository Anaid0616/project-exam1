import { setupNavbar } from "./navbar.mjs";
import { getQueryParam } from "./queryparams.mjs";
import { getBlogPostById } from "./postspostindex.mjs";
import {
  displayBlogPost,
  setupButtons,
  manageButtonVisibility,
} from "./postui.mjs";
import { showLoader, hideLoader } from "./loader.mjs";

// Set up the navbar for login/logout behavior
setupNavbar();

async function main() {
  const postId = getQueryParam("id");

  if (!postId) {
    console.error("No blog post ID found in the URL.");
    return;
  }

  showLoader();

  const blogPost = await getBlogPostById(postId);

  if (blogPost) {
    displayBlogPost(blogPost);
    setupButtons(blogPost);

    // Show the content container once the data is loaded
    document.getElementById("content").style.display = "block";
  }

  hideLoader();

  // Call the function to manage button visibility based on login status
  manageButtonVisibility();
}

// Example: Store blog posts in localStorage
function savePostsToLocalStorage(posts) {
  const savedPosts = { data: posts };
  localStorage.setItem("blogPosts", JSON.stringify(savedPosts));
}

// Fetch posts from localStorage
function getPostsFromLocalStorage() {
  const savedPosts = JSON.parse(localStorage.getItem("blogPosts"));
  return savedPosts ? savedPosts.data : [];
}

main();
