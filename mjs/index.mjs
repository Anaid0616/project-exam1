// index.mjs
import { setupNavbar } from './navbar.mjs';
import {
  fetchBlogPosts,
  createSlideElement,
  createThumbnailElement,
} from './blogservice.mjs';
import { shouldShowCreateButton } from './carouselservice.mjs';
import { getAccessToken } from './accesstoken.mjs';
import {
  initPagination,
  setPaginationItems,
  getPageItems,
  renderPagination,
} from './pagination.mjs';

// --- CONSTANTS / STATE ---
const POSTS_PER_PAGE = 12;

let allPosts = [];
let thumbnailPosts = [];
let filteredThumbnailPosts = [];

let carouselTrack;
let slides = [];

// Navbar
setupNavbar();

// When DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  // Initiera pagination–module
  initPagination({ selector: '#pagination', perPage: POSTS_PER_PAGE });

  await renderBlogFeed();
  setupFilterButtonsForPagination();
  manageButtonVisibility();

  // initialt filter
  applyTagFilter('all');
});

// -----------------------------------------------------------------------------
// Get and render carouselen + grid
// -----------------------------------------------------------------------------
async function renderBlogFeed() {
  carouselTrack = document.querySelector('[data-slides]');

  const thumbnailGrid = document.querySelector('.thumbnail-grid');
  const blogPosts = await fetchBlogPosts();

  if (!Array.isArray(blogPosts) || blogPosts.length === 0) {
    thumbnailGrid.innerHTML = '<p>No posts available</p>';
    return;
  }

  allPosts = blogPosts;

  // clear
  carouselTrack.innerHTML = '';
  thumbnailGrid.innerHTML = '';

  // CAROUSEL = 3 latest
  slides = allPosts.slice(0, 3).map((post) => createSlideElement(post));
  slides.forEach((slide) => carouselTrack.appendChild(slide));
  updateCarouselClasses();

  // GRID–data = the rest
  thumbnailPosts = allPosts.slice(3);
  filteredThumbnailPosts = thumbnailPosts;

  // Carousel–buttons
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

// -----------------------------------------------------------------------------
// GRID–rendering with pagination
// -----------------------------------------------------------------------------
function renderThumbnailPage() {
  const thumbnailGrid = document.querySelector('.thumbnail-grid');
  thumbnailGrid.innerHTML = '';

  const postsToShow = getPageItems();

  postsToShow.forEach((post) => {
    const thumbnail = createThumbnailElement(post);
    thumbnailGrid.appendChild(thumbnail);
  });

  // buttons for pagination
  renderPagination(() => {
    renderThumbnailPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// -----------------------------------------------------------------------------
// Filter buttons for pagination
// -----------------------------------------------------------------------------
function setupFilterButtonsForPagination() {
  const buttons = document.querySelectorAll('.tag-button');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const tag = button.dataset.tag;
      if (!tag) return;

      setActiveTagButton(tag);
      applyTagFilter(tag);
    });
  });

  setActiveTagButton('all');
}

function setActiveTagButton(tag) {
  const buttons = document.querySelectorAll('.tag-button');
  buttons.forEach((btn) => {
    if (btn.dataset.tag === tag) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function applyTagFilter(tag) {
  if (!thumbnailPosts || thumbnailPosts.length === 0) return;

  if (tag === 'all') {
    filteredThumbnailPosts = thumbnailPosts;
  } else {
    filteredThumbnailPosts = thumbnailPosts.filter((post) => {
      let tags = [];

      // Adjust for different tag formats
      if (Array.isArray(post.tags)) {
        tags = post.tags;
      } else if (typeof post.tags === 'string') {
        tags = post.tags.split(',').map((t) => t.trim());
      } else if (post.tag) {
        tags = [post.tag];
      }

      return tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase());
    });
  }

  // update pagination module with filtered items
  setPaginationItems(filteredThumbnailPosts);
  renderThumbnailPage();
}

// -----------------------------------------------------------------------------
// Carousel
// -----------------------------------------------------------------------------
function updateCarouselClasses() {
  if (!carouselTrack) return;

  const slideElements = Array.from(carouselTrack.children);
  if (slideElements.length === 0) return;

  slideElements.forEach((slide) => {
    slide.classList.remove('center-slide', 'left-slide', 'right-slide');
  });

  // MOBILE
  if (window.innerWidth <= 900) {
    if (slideElements[0]) {
      slideElements[0].classList.add('center-slide');
    }
    return;
  }

  // DESKTOP/TABLET
  if (slideElements[0]) slideElements[0].classList.add('left-slide');
  if (slideElements[1]) slideElements[1].classList.add('center-slide');
  if (slideElements[2]) slideElements[2].classList.add('right-slide');
}

// -----------------------------------------------------------------------------
// Create–post
// -----------------------------------------------------------------------------
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
  if (carouselContainer) {
    carouselContainer.insertAdjacentElement('afterend', createButton);
  }
}
