const searchInput = document.querySelector("#movieSearchInput");
const searchedButton = document.querySelector("#movieSearchButton");

searchedButton.addEventListener("click", (e) => {
  e.preventDefault();
  const inputText = searchInput.value.toLowerCase();
  const trimmedInput = inputText.trim();
  window.location.href = `./searched.html?&movie=${encodeURIComponent(trimmedInput)}`;
});

let count = 0;
$(document).ready(function () {
  getAllMovies(1);
});

const commonurl = "https://bollygradmovies.com/api/";
const movieCardContainer = document.querySelector(".movieCardContainer");
function getAllMovies(page) {
  $.ajax({
    url: `${commonurl}moviepage/${page}`,
    method: "GET",
    success: function (response) {
      if (response.status == 200) {
        const res = response.response;
        const movies = res.movies;
        count = res.off;
        mapWikiMovies(movies);
        handlePagination(res);
        handleGotoPage(res);
      }


    },
    error: function (xhr, status, error) {
      console.error("Error fetching movies:", error);
    }
  });
};
function mapWikiMovies(movies) {
    scrollTOTop();
  removeOverlay();
  
  const allMovies = movies.map((movie, index) => {
    return `<div class="movieCard">
    <div class="movie">
    <img src='https://bollygradmovies.com/api/${movie.poster}' alt="${movie.movie_name}" class="movieListPoster"/>
    </div>
    <div class="movieDetails">
    <div class="design topDesign"></div>
      <div class="details">
        <h4>${++count}. ${movie.movie_name}</h4>
        <p class="movieYear">
        ${movie.movie_year}
        </p>
        <div class="movieRating">
          ${stars(movie.rating)}
        </div>
      </div>
      <div class="movieLinks">
        <a href=./movie_details?&year=${movie.movie_year}&movie=${movie.id}&name=${encodeURIComponent(movie.movie_name)} class="mLinks btn btn-info">
          Read Details
        </a>
        <a href="#" target="_blank" class="mLinks  btn btn-danger">
          Watch it Now
        </a>
      </div>
    </div>
    <div class="design"></div>
  </div>`;
  }).join('');
  movieCardContainer.innerHTML = allMovies;
};

const nextPage = document.querySelector("#nextPage");
const prevPage = document.querySelector("#prevPage");
const currentPage = document.querySelector("#currentPage");
const totalPages = document.querySelector("#totalPages");
function handlePagination(response) {
  currentPage.innerHTML = response.current;
  totalPages.innerHTML = response.totalPage;
  if (response.current == 1) {
    prevPage.classList.add("hide");
  } else {
    prevPage.classList.remove("hide");
  }
  if (response.totalPage == response.current) {
    nextPage.classList.add("hide");
  } else {
    nextPage.classList.remove("hide");
  }
};

const page = document.querySelector("#page")
function handleGotoPage(response) {
  const total = response.totalPage;
  let numbers = [];
  for (let index = 0; index < total; index++) {
    let i = index + 1;
    const option = `<option value="${i}">${i}</option>`;
    numbers.push(option);
  }
  let options = '<option value="">Goto page</option>' + numbers.join('');
  page.innerHTML = options;
//   loadPageGoto();
  onChangePageNumber();

}
function loadPageGoto() {
  const loadPageNumber = document.querySelector("#loadPageNumber");
  loadPageNumber.addEventListener("click", (e) => {
    e.preventDefault();
    const pagenum = page.value;
    if (pagenum == "") {
      getAllMovies(1);
      dealWithOverlay();
    }
    getAllMovies(pagenum);
    dealWithOverlay();
  });
}
function onChangePageNumber() {
  page.addEventListener("change", () => {
    const pagenum = page.value;
    if (pagenum == "") {
      getAllMovies(1);
      dealWithOverlay();
    }
    getAllMovies(pagenum);
    dealWithOverlay();
  })
}

nextPage.addEventListener("click", (e) => {
  e.preventDefault();
  const current = document.querySelector("#currentPage");
  let currentP = current.innerHTML;
  getAllMovies(++currentP);
  dealWithOverlay();
});
prevPage.addEventListener("click", (e) => {
  e.preventDefault();
  const current = document.querySelector("#currentPage");
  let currentP = current.innerHTML;
  getAllMovies(--currentP);
  dealWithOverlay();
});

const overlay = document.querySelector("#overlay");
function dealWithOverlay() {
  overlay.style.display = "flex";
};
function removeOverlay() {
  overlay.style.display = "none";
};
function scrollTOTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
function stars(rating) {
  const number = String(rating);
  const numbers = number.split(".")
  const full = Number(numbers[0]);
  const half = Number(numbers[1]);
  let stars = [];
  for (let index = 0; index < full; index++) {
    const element = '<div class="starRating full"></div>';
    stars.push(element);
  }
  if (half) {
    const halfStar = '<div class="starRating half" ></div>';
    stars.push(halfStar);
  }
  const starMarkup = stars.map((element) => {
    return element;
  }).join("");
  return starMarkup;
}