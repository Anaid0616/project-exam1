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
import { setupNavbar } from "./navbar.mjs"; // Import the navbar setup function

// Set up the navbar for login/logout behavior
setupNavbar();

let currentIndex = 0;
let slides = [];
let totalSlides = 3;
const transitionTime = 500; // time in ms

document.addEventListener("DOMContentLoaded", async () => {
  await renderBlogFeed();
});

async function fetchBlogPosts() {
  try {
    const response = await fetch(BLOG_POSTS_API_ENDPOINT);
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
    return;
  }

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

// Function to create a carousel slide (I did the img carousel with help from Web Dev Simplified: www.youtube.com/watch?v=9HcxHDS2w1s, but it caused a great deal of problems because it wasn't in the flow, so in the end i changed it with help from chatGPT to a better one.

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

// Function to create a thumbnail for the grid ( i did the grid with help from this www.youtube.com/watch?v=TuBwe6SLRlU&t=328s, and then got it updated to work with the other things i have with help from chatGPT)
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
