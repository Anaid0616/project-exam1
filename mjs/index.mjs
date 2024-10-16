import { getAccessToken } from "./accesstoken.mjs";
import {
  BLOG_POSTS_API_ENDPOINT,
  UPDATE_POST_API_ENDPOINT,
  DELETE_POST_API_ENDPOINT,
  GET_POST_API_ENDPOINT,
} from "./api.mjs";
import {
  removePostFromLocalStorage,
  updateLocalStoragePost,
} from "./postutils.mjs";
import { setupNavbar } from "./navbar.mjs";

// Set up the navbar for login/logout behavior
setupNavbar();

//slides
let currentIndex = 0;
let slides = [];
let totalSlides = 3;
const transitionTime = 500;

document.addEventListener("DOMContentLoaded", async () => {
  await renderBlogFeed();
  manageButtonVisibility();
});

// Function to create a "Create" button for logged-in users
function renderCreateButton() {
  const createButton = document.createElement("button");
  createButton.id = "create-button";
  createButton.innerText = "Create New Post";
  createButton.classList.add("create-post-button");

  createButton.addEventListener("click", () => {
    window.location.href = "./post/edit.html";
  });

  // Find the carousel and the thumbnail grid
  const carouselContainer = document.querySelector(".carousel-container");
  const thumbnailGrid = document.querySelector(".thumbnail-grid");

  if (carouselContainer && thumbnailGrid) {
    // Insert the button between the carousel and thumbnail grid
    carouselContainer.insertAdjacentElement("afterend", createButton);
  }
}

// Function to manage button visibility based on login status
function manageButtonVisibility() {
  const isLoggedIn = !!getAccessToken(); // Check if the user is logged in by checking for a valid token

  const createButton = document.getElementById("create-button");
  if (createButton) {
    if (isLoggedIn) {
      createButton.style.display = "block";
    } else {
      createButton.style.display = "none";
    }
  } else if (isLoggedIn) {
    renderCreateButton();
  }
}

// Call this function when the DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
  await renderBlogFeed(fetchBlogPosts);
  manageButtonVisibility();
});

async function fetchBlogPosts() {
  try {
    const response = await fetch(BLOG_POSTS_API_ENDPOINT());
    if (!response.ok)
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

async function renderBlogFeed() {
  const carouselTrack = document.querySelector("[data-slides]");
  const thumbnailGrid = document.querySelector(".thumbnail-grid");

  const blogPosts = await fetchBlogPosts();

  if (!Array.isArray(blogPosts) || blogPosts.length === 0) {
    console.log("No blog posts found.");
    document.querySelector(".thumbnail-grid").innerHTML =
      "<p>No posts available</p>";
    return;
  }

  // Step 1: Ensure every post has a unique ID (if missing)
  const updatedBlogPosts = blogPosts.map((post) => {
    if (!post.id) {
      post.id = generateUniqueId(); // Use function to generate ID if missing
    }
    return post;
  });

  const savedPosts = { data: updatedBlogPosts };
  localStorage.setItem("blogPosts", JSON.stringify(savedPosts));

  // Clear existing content before rendering
  carouselTrack.innerHTML = "";
  thumbnailGrid.innerHTML = "";

  // Render carousel slides (first 3 posts)
  slides = blogPosts.slice(0, 3).map((post) => createSlide(post));
  slides.forEach((slide) => carouselTrack.appendChild(slide));
  totalSlides = slides.length;

  // Set width for the carousel track
  carouselTrack.style.width = `${totalSlides * 100}%`;

  // Render thumbnail grid (remaining posts)
  blogPosts.slice(3).forEach((post) => {
    const thumbnail = createThumbnail(post);
    thumbnailGrid.appendChild(thumbnail);
  });

  // Add carousel button functionality
  document
    .querySelector(".carousel-button.next")
    .addEventListener("click", () => moveSlide(1));
  document
    .querySelector(".carousel-button.prev")
    .addEventListener("click", () => moveSlide(-1));
}

// Function to create a carousel slide
function createSlide(post) {
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

// Function to create a thumbnail for the grid
function createThumbnail(post) {
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

// Move carousel slides
function moveSlide(offset) {
  const track = document.querySelector("[data-slides]");
  currentIndex = (currentIndex + offset + totalSlides) % totalSlides;
  track.style.transform = `translateX(-${currentIndex * (100 / totalSlides)}%)`;
}

const carouselTrack = document.querySelector(".carousel-track");
carouselTrack.style.width = `${totalSlides * 100}%`;
