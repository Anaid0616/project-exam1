// form utils on post edit
export function clearForm() {
  document.querySelector("#title-input").value = "";
  document.querySelector("#img-input").value = "";
  document.querySelector("#alt-input").value = "";
  document.querySelector("#body-input").value = "";
  document.querySelector("#tags-input").value = "";
}

export function populateEditForm(post) {
  document.querySelector("#title-input").value = post.title;
  document.querySelector("#img-input").value = post.media?.url || "";
  document.querySelector("#alt-input").value = post.media?.alt || "";
  document.querySelector("#body-input").value = post.body;
  document.querySelector("#tags-input").value = post.tags.join(" ");
}
