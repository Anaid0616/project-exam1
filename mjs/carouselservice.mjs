// carousel index
export function moveSlide(currentIndex, totalSlides, offset) {
  return (currentIndex + offset + totalSlides) % totalSlides;
}

export function shouldShowCreateButton(isLoggedIn) {
  return isLoggedIn;
}
