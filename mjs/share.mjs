// share.js

document.getElementById("share-icon").addEventListener("click", function () {
  const postUrl = window.location.href; // Get the current blog post URL
  const postTitle = document.getElementById("post-title").innerText; // Get the post title for sharing

  if (navigator.share) {
    // Use Web Share API if supported
    navigator
      .share({
        title: postTitle,
        url: postUrl,
      })
      .then(() => console.log("Shared successfully"))
      .catch((err) => console.error("Error sharing:", err));
  } else {
    // Fallback to copying the URL to the clipboard
    navigator.clipboard
      .writeText(postUrl)
      .then(() => {
        alert("Post link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Error copying link:", err);
      });
  }
});
