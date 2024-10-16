import { showToast } from "./toast.mjs";

document.getElementById("share-div").addEventListener("click", function () {
  const postUrl = window.location.href;
  const postTitle = document.getElementById("post-title").innerText;

  // Copy the post URL to the clipboard
  navigator.clipboard
    .writeText(postUrl)
    .then(() => {
      showToast("Post link copied to clipboard!", "success");
    })
    .catch((err) => {
      console.error("Error copying link:", err);
      showToast("Failed to copy the link. Please try again.", "error");
    });
});
