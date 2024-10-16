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
  console.log("Post ID:", postId);
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

main();
