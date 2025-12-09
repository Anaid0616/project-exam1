// pagination.mjs

let items = [];
let itemsPerPage = 12;
let currentPage = 1;
let paginationElement = null;

/**
 * Initialize pagination
 * @param {Object} options
 * @param {string} options.selector - CSS–selector for pagination container
 * @param {number} options.perPage - Items per page
 */
export function initPagination({
  selector = '#pagination',
  perPage = 12,
} = {}) {
  paginationElement = document.querySelector(selector);
  itemsPerPage = perPage;
}

/**
 * Set items for pagination
 */
export function setPaginationItems(newItems) {
  items = Array.isArray(newItems) ? newItems : [];
  currentPage = 1;
}

/**
 * Get items for current page
 */
export function getPageItems() {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return items.slice(start, end);
}

/**
 * Get current page number
 */
export function getCurrentPage() {
  return currentPage;
}

/**
 * Render buttons connect click–events
 * onPageChange = callback
 */
export function renderPagination(onPageChange) {
  if (!paginationElement) return;

  paginationElement.innerHTML = '';

  const totalPages = Math.ceil(items.length / itemsPerPage);
  if (totalPages <= 1) return;

  // Prev
  const prevBtn = document.createElement('button');
  prevBtn.textContent = '«';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      onPageChange(currentPage);
    }
  });
  paginationElement.appendChild(prevBtn);

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');
    btn.addEventListener('click', () => {
      currentPage = i;
      onPageChange(currentPage);
    });
    paginationElement.appendChild(btn);
  }

  // Next
  const nextBtn = document.createElement('button');
  nextBtn.textContent = '»';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      onPageChange(currentPage);
    }
  });
  paginationElement.appendChild(nextBtn);
}
