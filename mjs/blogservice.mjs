// blogService index
import { BLOG_POSTS_API_ENDPOINT } from "./api.mjs";
import { getAccessToken } from "./accesstoken.mjs";

// Fetch blog posts
export async function fetchBlogPosts() {
  try {
    const apiUrl = BLOG_POSTS_API_ENDPOINT();
    console.log("Fetching from API URL:", apiUrl);

    const headers = {};
    const accessToken = getAccessToken();
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(apiUrl, { method: "GET", headers });
    if (!response.ok)
      throw new Error(`Failed to fetch posts: ${response.statusText}`);

    const data = await response.json();
    console.log("Fetched posts response: ", data);
    return data.data;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

// Create slide HTML element
export function createSlideElement(post) {
  const slide = document.createElement("li");
  slide.classList.add("carousel-slide");
  slide.innerHTML = `
    <div class="blog-content">
      <a href="./post/index.html?id=${post.id}">
        <img src="${post.media?.url || "default.jpg"}" class="slide-img" alt="${
    post.media?.alt || "Image"
  }">
      </a>
      <h1>${post.title}</h1>
      <p>${post.body?.slice(0, 100) || ""}...</p>
      <a href="./post/index.html?id=${
        post.id
      }" class="read-more-button1" aria-label="Read more about ${
    post.title
  }">Read more</a>
    </div>
  `;
  return slide;
}

// Create thumbnail HTML element
export function createThumbnailElement(post) {
  const div = document.createElement("div");
  div.classList.add("thumbnail");
  div.innerHTML = `
    <a href="./post/index.html?id=${post.id}" class="img-link">
      <img src="${post.media?.url || "default.jpg"}" alt="${
    post.media?.alt || "Image"
  }">
    </a>
    <h2>${post.title}</h2>
    <p>${post.body?.slice(0, 100) || ""}...</p>
    <a href="./post/index.html?id=${
      post.id
    }" class="read-more-button" aria-label="Read more about ${
    post.title
  }">Read more</a>
  `;
  return div;
}
