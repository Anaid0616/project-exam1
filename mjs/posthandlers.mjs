// edit and delete post edit
export async function handleEditBlogPost(postId, updatedPost) {
  const savedPosts = JSON.parse(localStorage.getItem("blogPosts")) || [];
  const updatedPosts = savedPosts.map((post) =>
    post.data.id === postId ? { data: updatedPost } : post
  );
  localStorage.setItem("blogPosts", JSON.stringify(updatedPosts));

  window.location.href = "./index.html";
}

export async function handleDeleteBlogPost(postId) {
  const savedPosts = JSON.parse(localStorage.getItem("blogPosts")) || [];
  const remainingPosts = savedPosts.filter((post) => post.data.id !== postId);
  localStorage.setItem("blogPosts", JSON.stringify(remainingPosts));

  window.location.href = "./index.html";
}
