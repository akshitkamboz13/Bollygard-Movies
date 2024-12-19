
const commonurl = "https://bollygradmovies.com/api/";


const popular = document.querySelector("#popular");
const trending = document.querySelector("#trending");
const tvshows = document.querySelector("#tvshows");
const action = document.querySelector("#action");
const thriller = document.querySelector("#thriller");
const comedymovie = document.querySelector("#comedymovie");
const horrormovie = document.querySelector("#horrormovie");
const animationmovie = document.querySelector("#animationmovie");
const lovestory = document.querySelector("#lovestory");
const horrorcomedy = document.querySelector("#horrorcomedy");


$(document).ready(function () {
    fetchData();
    soundMute();
});



function soundMute() {
    $("#volume").click(function () {
        $(this).toggleClass("fa-volume-mute fa-volume-up");
        $("#video").prop("muted", !$("#video").prop("muted"));
    });
};

function mapMovies(category, container) {
    const movies = category.map((movie) => {
        return `
        <div>
            <img class="posterImg" id="${movie.id}" loading="lazy" src="${movie.img}" alt="${movie.name}">
        </div>
        `;
    }).join('');

    container.innerHTML = movies;
};


function getId(url) {
    const pattern = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
    const match = url.match(pattern);

    if (match && match[1]) {
        return match[1];
    }
    return null;
};

function redirectFunction() {
    const posters = document.querySelectorAll(".posterImg");
    posters.forEach((poster) => {
        poster.addEventListener("click", (e) => {
            e.preventDefault();
            // const url = "https://youtu.be/";
            const id = poster.getAttribute("id");
            getLink(id);
            
        });
    });
};
function fetchData() {
    $.ajax({
        url: `${commonurl}movie_show/`,
        method: "GET",
        success: function (response) {
            const popularItem = filterDataSubCategoyWise(response, "popular");
            const trendingItem = filterDataSubCategoyWise(response, "trending");
            const thrillerMovie = filterDataCategoryAndSub(response, "movie", "thriller");
            const  comedyMovie= filterDataCategoryAndSub(response, "movie","comedy");
            const  actionMovie= filterDataCategoryAndSub(response, "movie","action");
            const  horrorComedyMovie= filterDataCategoryAndSub(response, "movie","horror comedy");
            const  horrorMovie= filterDataCategoryAndSub(response, "movie","horror");
            const  animationMovie= filterDataCategoryAndSub(response, "movie","animation");
            const  loveStoryMovie= filterDataCategoryAndSub(response, "movie","love story");
            const tvshow = filterDataCategoryWise(response, "tv show");
            mapMovies(popularItem, popular);
            mapMovies(trendingItem, trending);
            mapMovies(tvshow, tvshows);
            mapMovies(thrillerMovie,thriller);
            mapMovies(comedyMovie,comedymovie);
            mapMovies(actionMovie,action);
            mapMovies(horrorMovie,horrormovie);
            mapMovies(animationMovie,animationmovie);
            mapMovies(loveStoryMovie,lovestory);
            mapMovies(horrorComedyMovie,horrorcomedy);
            
            redirectFunction();
            owl();
            dealHover();

        },
        error: function (xhr, status, error) {
            console.error("Error creating visitor count:", error);
        }
    });

}

function filterDataSubCategoyWise(data, type) {
    const filteredData = data.filter((item) => {
        return item.sub_category_name === type
    });
    return filteredData;
}
function filterDataCategoryWise(data, type) {
    const filteredData = data.filter((item) => {
        return item.category_name === type
    });
    return filteredData;
}
function filterDataCategoryAndSub(data, cat,sub) {
    const filteredData = data.filter((item) => {
        return item.category_name === cat && item.sub_category_name === sub
    });
    return filteredData;
}
function getLink(id){
    $.ajax({
        url: `${commonurl}movie_show/${id}/`, 
        method: "GET",
        success: function(response) {
            if(response){
                countView(id);
                const  link  =  response.link;
                const newTab = window.open();
                newTab.location.href = link;
            }
        },
        error: function(xhr, status, error) {
          console.error("Error fetching categories:", error);
        }
      });
};

function countView(id){
    $.ajax({
        url: `${commonurl}view/`, 
        method: "POST",
        data: {"item":id},
        success: function(response) {
            if(response){
                console.log(response);
            }
        },
        error: function(xhr, status, error) {
          console.error("Error counting view:", error);
        }
      });
};

function scroll() {
    const top = document.querySelector("#top");
    const brand = document.querySelector("#navBrand");
    window.addEventListener("scroll", () => {
        const scrollHeight = window.scrollY;
        if (scrollHeight > 350) {
            top.classList.add('backGround');
            brand.classList.remove('brandBack');
        } else {
            top.classList.remove('backGround');
            brand.classList.add('brandBack');
        }
    });
}
scroll();

function dealHover() {
    const posterImg = document.querySelectorAll(".posterImg");
    posterImg.forEach((img,index) => {
        img.addEventListener("mouseover", () => {
            img.classList.add("hoverEffect");
            const next = index +  1;
            posterImg.forEach((item) => {
                if (item.classList.contains("hoverEffect")) {
                    posterImg[next].classList.add("hoverEffectDown");
                } 
            });
        });

        img.addEventListener("mouseout", () => {
            posterImg.forEach((item) => {
                if (item.classList.contains("hoverEffectDown")) {
                    item.classList.remove("hoverEffectDown");
                } else if (item.classList.contains("hoverEffect")) {
                    item.classList.remove("hoverEffect");
                }
            });

        });
        
    });
}