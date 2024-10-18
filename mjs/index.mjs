// index.mjs
import { setupNavbar } from "./navbar.mjs";
import {
  fetchBlogPosts,
  createSlideElement,
  createThumbnailElement,
} from "./blogservice.mjs";
import { moveSlide, shouldShowCreateButton } from "./carouselservice.mjs";
import { getAccessToken } from "./accesstoken.mjs";

// Set up the navbar
setupNavbar();

let currentIndex = 0;
let slides = [];
let totalSlides = 3;

document.addEventListener("DOMContentLoaded", async () => {
  await renderBlogFeed();
  manageButtonVisibility();
});

// Render blog feed
async function renderBlogFeed() {
  const carouselTrack = document.querySelector("[data-slides]");
  const thumbnailGrid = document.querySelector(".thumbnail-grid");

  console.log("Fetching blog posts...");
  const blogPosts = await fetchBlogPosts();
  console.log("Fetched blog posts:", blogPosts);

  if (!Array.isArray(blogPosts) || blogPosts.length === 0) {
    console.log("No blog posts found.");
    thumbnailGrid.innerHTML = "<p>No posts available</p>";
    return;
  }

  // Clear existing content before rendering
  carouselTrack.innerHTML = "";
  thumbnailGrid.innerHTML = "";

  // Render carousel slides (first 3 posts)
  slides = blogPosts.slice(0, 3).map((post) => createSlideElement(post));
  slides.forEach((slide) => carouselTrack.appendChild(slide));
  totalSlides = slides.length;

  // Set width for the carousel track
  carouselTrack.style.width = `${totalSlides * 100}%`;

  // Render thumbnail grid (remaining posts)
  blogPosts.slice(3).forEach((post) => {
    const thumbnail = createThumbnailElement(post);
    thumbnailGrid.appendChild(thumbnail);
  });

  // Add carousel button functionality
  document
    .querySelector(".carousel-button.next")
    .addEventListener("click", () => {
      currentIndex = moveSlide(currentIndex, totalSlides, 1);
      carouselTrack.style.transform = `translateX(-${
        currentIndex * (100 / totalSlides)
      }%)`;
    });
  document
    .querySelector(".carousel-button.prev")
    .addEventListener("click", () => {
      currentIndex = moveSlide(currentIndex, totalSlides, -1);
      carouselTrack.style.transform = `translateX(-${
        currentIndex * (100 / totalSlides)
      }%)`;
    });
}

// Manage button visibility
function manageButtonVisibility() {
  const isLoggedIn = !!getAccessToken();
  const createButton = document.getElementById("create-button");

  if (createButton) {
    createButton.style.display = shouldShowCreateButton(isLoggedIn)
      ? "block"
      : "none";
  } else if (isLoggedIn) {
    renderCreateButton();
  }
}

function renderCreateButton() {
  const createButton = document.createElement("button");
  createButton.id = "create-button";
  createButton.innerText = "Create New Post";
  createButton.classList.add("create-post-button");

  createButton.addEventListener("click", () => {
    window.location.href = "./post/edit.html";
  });

  const carouselContainer = document.querySelector(".carousel-container");
  const thumbnailGrid = document.querySelector(".thumbnail-grid");

  if (carouselContainer && thumbnailGrid) {
    carouselContainer.insertAdjacentElement("afterend", createButton);
  }
}
