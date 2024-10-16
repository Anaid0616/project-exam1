import { setupNavbar } from "./navbar.mjs";
import { getQueryParam } from "./queryparams.mjs";
import {
  createBlogPost,
  updateBlogPost,
  getBlogPostById,
} from "./blogposts.mjs";
import { showToast } from "./toast.mjs";
import { clearForm, populateEditForm } from "./formutils.mjs";
import { isValidImageUrl, validateImageUrl } from "./validation.mjs";

// Set up the navbar for login/logout behavior
setupNavbar();

document.addEventListener("DOMContentLoaded", async function () {
  const postId = getQueryParam("id");

  if (postId) {
    const post = await getBlogPostById(postId);
    populateEditForm(post);
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

      if (!isValidImageUrl(blogPost.media.url)) {
        showToast(
          "Please enter a valid image URL with .jpg, .jpeg, .gif, or .png extension.",
          "error"
        );
        return;
      }

      validateImageUrl(
        blogPost.media.url,
        async function () {
          try {
            if (postId) {
              await updateBlogPost(postId, blogPost);
              showToast("Post updated successfully!");
              setTimeout(() => {
                window.location.href = `../post/index.html?id=${postId}`;
              }, 1800);
            } else {
              await createBlogPost(blogPost);
              showToast("Post created successfully!");
              clearForm();
              setTimeout(() => {
                console.log(postId);
                window.location.href = "./index.html";
              }, 1800);
            }
          } catch (error) {
            console.error("Error during form submission:", error);
            showToast("An error occurred. Please try again.");
          }
        },
        function () {
          showToast(
            "The image URL is invalid. Please provide a valid image link.",
            "error"
          );
        }
      );
    });
  }
});
