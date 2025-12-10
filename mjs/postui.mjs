import { showToast } from './toast.mjs';
import { setupDeleteModal } from './modal.mjs';
import { deleteBlogPost } from './postspostindex.mjs';
import { removePostFromLocalStorage } from './postutils.mjs';
import { getAccessToken } from './accesstoken.mjs';

//rendering blog post content, setting up buttons, handling visibility post index
export function displayBlogPost(post) {
  if (!post) return;

  document.getElementById('post-title').innerText = post.title;
  document.getElementById('post-author').innerText =
    post.author?.name || 'Unknown Author';
  document.getElementById('post-date').innerText = post.created
    ? new Date(post.created).toLocaleDateString()
    : post.updated
    ? new Date(post.updated).toLocaleDateString()
    : 'Unknown Date';
  document.getElementById('post-image').src =
    post.media?.url || 'default-image.jpg';
  document.getElementById('post-image').alt = post.media?.alt || 'Blog image';
  document.getElementById('post-body').innerHTML = post.body;
}

export function setupButtons(post) {
  const editButton = document.getElementById('edit-button');
  const deleteButton = document.getElementById('delete-button');

  if (editButton) {
    editButton.addEventListener('click', function (event) {
      event.preventDefault();
      window.location.href = `../post/edit.html?id=${post.id}`;
    });
  }

  // Use the imported function for setting up the delete modal
  setupDeleteModal(post, async function (postId) {
    const success = await deleteBlogPost(postId);
    if (success) {
      removePostFromLocalStorage(postId);
      showToast('Post deleted successfully!', 'success');
    } else {
      showToast('Failed to delete post. Please try again.', 'error');
    }
  });
}

export function manageButtonVisibility() {
  const isLoggedIn = !!getAccessToken();
  const editButton = document.getElementById('edit-button');
  const deleteButton = document.getElementById('delete-button');

  if (isLoggedIn) {
    if (editButton) editButton.style.display = 'block';
    if (deleteButton) deleteButton.style.display = 'block';
  } else {
    if (editButton) editButton.style.display = 'none';
    if (deleteButton) deleteButton.style.display = 'none';
  }
}
