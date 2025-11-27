// index.mjs
import { setupNavbar } from './navbar.mjs';
import {
  fetchBlogPosts,
  createSlideElement,
  createThumbnailElement,
} from './blogservice.mjs';
import { moveSlide, shouldShowCreateButton } from './carouselservice.mjs';
import { getAccessToken } from './accesstoken.mjs';
import { applyFilter, setupFilterButtons } from './filter.mjs';

// Set up the navbar
setupNavbar();

let currentIndex = 0;
let slides = [];
let totalSlides = 3;
let carouselTrack;

function handleFilterChange(event) {
  const target = event.target;

  // Make sure the event is from a button and has a data-tag attribute
  if (target && target.tagName === 'BUTTON') {
    const selectedTag = target.getAttribute('data-tag');
    if (!selectedTag) {
      console.error('Tag not found in clicked button');
      return;
    }
    applyFilter(selectedTag, fetchBlogPosts); // Call applyFilter with the selected tag
  } else {
    console.error('Event target is not a valid button or missing data-tag');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await renderBlogFeed();
  manageButtonVisibility();

  // Set up filter buttons and apply initial filter
  setupFilterButtons(handleFilterChange);
  applyFilter('all');
});

// Render blog feed
async function renderBlogFeed() {
  carouselTrack = document.querySelector('[data-slides]');

  const thumbnailGrid = document.querySelector('.thumbnail-grid');

  const blogPosts = await fetchBlogPosts();

  if (!Array.isArray(blogPosts) || blogPosts.length === 0) {
    console.log('No blog posts found.');
    thumbnailGrid.innerHTML = '<p>No posts available</p>';
    return;
  }

  // Clear existing content before rendering
  carouselTrack.innerHTML = '';
  thumbnailGrid.innerHTML = '';

  // Render carousel slides (first 3 posts)
  slides = blogPosts.slice(0, 3).map((post) => createSlideElement(post));
  slides.forEach((slide) => carouselTrack.appendChild(slide));
  totalSlides = slides.length;

  updateCarouselClasses();

  // Render thumbnail grid (remaining posts)
  const thumbnailPosts = blogPosts.slice(3); // Posts after the first 3
  thumbnailPosts.forEach((post) => {
    const thumbnail = createThumbnailElement(post);
    thumbnailGrid.appendChild(thumbnail);
  });

  applyFilter('all');

  // Add carousel button functionality

  document
    .querySelector('.carousel-button.next')
    .addEventListener('click', () => {
      const first = carouselTrack.firstElementChild;
      if (first) {
        carouselTrack.appendChild(first);
        updateCarouselClasses();
      }
    });

  document
    .querySelector('.carousel-button.prev')
    .addEventListener('click', () => {
      const last = carouselTrack.lastElementChild;
      const first = carouselTrack.firstElementChild;
      if (last && first) {
        carouselTrack.insertBefore(last, first);
        updateCarouselClasses();
      }
    });
}

function updateCarouselClasses() {
  if (!carouselTrack) return;

  const slideElements = Array.from(carouselTrack.children);
  if (slideElements.length === 0) return;

  slideElements.forEach((slide) => {
    slide.classList.remove('center-slide', 'left-slide', 'right-slide');
  });

  // position 0 = left, 1 = middle (active), 2 = right
  if (slideElements[0]) slideElements[0].classList.add('left-slide');
  if (slideElements[1]) slideElements[1].classList.add('center-slide');
  if (slideElements[2]) slideElements[2].classList.add('right-slide');
}

// Manage button visibility
function manageButtonVisibility() {
  const isLoggedIn = !!getAccessToken();
  const createButton = document.getElementById('create-button');

  if (createButton) {
    createButton.style.display = shouldShowCreateButton(isLoggedIn)
      ? 'block'
      : 'none';
  } else if (isLoggedIn) {
    renderCreateButton();
  }
}

function renderCreateButton() {
  const createButton = document.createElement('button');
  createButton.id = 'create-button';
  createButton.innerText = 'Create New Post';
  createButton.classList.add('create-post-button');

  createButton.addEventListener('click', () => {
    window.location.href = './post/edit.html';
  });

  const carouselContainer = document.querySelector('.carousel-container');
  const thumbnailGrid = document.querySelector('.thumbnail-grid');

  if (carouselContainer && thumbnailGrid) {
    carouselContainer.insertAdjacentElement('afterend', createButton);
  }
}
