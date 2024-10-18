export function setupDeleteModal(post, deleteBlogPost) {
  const deleteButton = document.getElementById("delete-button");

  if (!deleteButton) {
    console.error("Delete button not found or not configured correctly.");
    return;
  }

  deleteButton.addEventListener("click", function (event) {
    event.preventDefault();

    const modal = document.getElementById("deleteModal");
    if (modal) {
      modal.style.display = "block"; // Show the modal
    }

    // Ensure these buttons exist only once inside the modal
    const confirmDeleteButton = document.getElementById("confirmDelete");
    const cancelDeleteButton = document.getElementById("cancelDelete");

    if (!confirmDeleteButton || !cancelDeleteButton) {
      console.error("Confirm or Cancel Delete button not found.");
      return;
    }

    // Attach event listener to confirm deletion (only once)
    confirmDeleteButton.onclick = async function () {
      await deleteBlogPost(post.id);
      modal.style.display = "none"; // Hide the modal after deletion
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1500);
    };

    // Attach event listener to cancel button
    cancelDeleteButton.onclick = function () {
      modal.style.display = "none"; // Close the modal when cancel is clicked
    };

    // Optional: Close modal if user clicks outside
    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  });
}
