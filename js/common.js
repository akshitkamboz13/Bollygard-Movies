const searchedInput = document.querySelector("#searchedInput");
const searchButton = document.querySelector("#searchButton");

searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  const inputText = searchedInput.value.toLowerCase();
  const trimmedInput = inputText.trim();
  window.location.href = `./search?&movie=${encodeURIComponent(trimmedInput)}`;
});