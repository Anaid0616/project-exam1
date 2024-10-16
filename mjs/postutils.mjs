// remove post
export function removePostFromLocalStorage(postId) {
  let posts = JSON.parse(localStorage.getItem("blogPosts")) || {
    data: [],
    meta: {},
  };

  // Check if posts have the expected structure
  if (!Array.isArray(posts.data)) {
    console.error("Expected posts.data to be an array but got:", posts.data);
    return;
  }

  // Filter out the post with the given ID from the data array
  posts.data = posts.data.filter((post) => post.id !== postId);

  // Save the updated posts object (including meta) back to localStorage
  localStorage.setItem("blogPosts", JSON.stringify(posts));
}

// update post
export function updateLocalStoragePost(postId, updatedPost) {
  const savedPosts = JSON.parse(localStorage.getItem("blogPosts")) || {
    data: [],
  };
  if (Array.isArray(savedPosts.data)) {
    // Update the post in the localStorage array
    savedPosts.data = savedPosts.data.map((post) =>
      post.id === postId ? updatedPost : post
    );
    localStorage.setItem("blogPosts", JSON.stringify(savedPosts));
  } else {
    console.error(
      "Expected savedPosts.data to be an array but got:",
      savedPosts.data
    );
  }
}
