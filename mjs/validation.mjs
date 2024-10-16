// validation img post edit
export function isValidImageUrl(url) {
  return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
}

export function validateImageUrl(url, onSuccess, onError) {
  const img = new Image();
  img.onload = onSuccess;
  img.onerror = onError;
  img.src = url;
}
