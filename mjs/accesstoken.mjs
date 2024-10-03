//1. Create function that is going to store our access token
//2. Create function that retrieves our access token

export function storeAccessToken(accessToken) {
  localStorage.setItem("accessToken", accessToken);
}
export function getAccessToken() {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken;
}

// Function to remove the access token (logout)
export function removeAccessToken() {
  localStorage.removeItem("accessToken"); // Remove the token from local storage
}
