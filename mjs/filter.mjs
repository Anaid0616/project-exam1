import { createThumbnailElement } from "./blogservice.mjs"; // filter.mjs
import { fetchBlogPosts } from "./blogservice.mjs";

// Function to filter and display blog posts by selected tag
export async function applyFilter(selectedTag) {
  const blogPosts = await fetchBlogPosts();
  const blogPostsGrid = document.querySelector(".thumbnail-grid");

  console.log("Filtering by tag:", selectedTag);
  console.log("Posts to filter:", blogPosts);

  blogPostsGrid.innerHTML = "";

  // Filter and display blog posts by tag
  for (let i = 0; i < blogPosts.length; i++) {
    const post = blogPosts[i];
    const postTags = post.tags.map((tag) => tag.toLowerCase());

    // Display post if "all" is selected or the post has the selected tag
    if (selectedTag === "all" || postTags.includes(selectedTag)) {
      const thumbnail = createThumbnailElement(post);
      blogPostsGrid.appendChild(thumbnail);
    }
  }
}

// Function to set up filter buttons
export function setupFilterButtons(handleFilterChange) {
  const filterButtons = document.getElementById("filterButtons");

  filterButtons.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
      handleFilterChange(event); // Call handleFilterChange when a button is clicked
    }
  });
}
