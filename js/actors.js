document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector("#peopleSearchInput");
    const searchedButton = document.querySelector("#peopleSearchButton");
    const peopleContainer = document.querySelector(".peopleContainer");
    const pageDropdown = document.querySelector("#page");
    const overlay = document.querySelector("#overlay");
    const nextPage = document.querySelector("#nextPage");
    const prevPage = document.querySelector("#prevPage");
    const currentPage = document.querySelector("#currentPage");
    const totalPages = document.querySelector("#totalPages");
    const commonUrl = "https://bollygradmovies.com/api/";

    // Event Listener for Search Button
    searchedButton.addEventListener("click", (e) => {
        e.preventDefault();
        const trimmedInput = searchInput.value.trim().toLowerCase();
        if (trimmedInput) {
            window.location.href = `./searchedPeople.html?&people=${encodeURIComponent(trimmedInput)}`;
        }
    });

    // Initial Fetch of People Data
    fetchPeople(1);

    // Fetch People Data from API
    async function fetchPeople(pageNumber) {
        toggleOverlay(true);
        try {
            const response = await fetch(`${commonUrl}people_pages/${pageNumber}`);
            const data = await response.json();

            if (response.ok && data.status === 200) {
                const { people, totalPage, current, off } = data.response;
                mapPeople(people);
                updatePagination(current, totalPage);
                setupGotoPage(totalPage);
            } else {
                console.error("Error fetching people:", data);
            }
        } catch (error) {
            console.error("Network error:", error);
        } finally {
            toggleOverlay(false);
        }
    }

    // Map and Display People Cards
    function mapPeople(peoples) {
        scrollToTop();
        peopleContainer.innerHTML = peoples
            .map(people => `
                <div class="peopleCard">
                    <div class="peopleCardLeft">
                        <img src="${people.picture || './img/default_people.png'}" alt="${people.name}">
                    </div>
                    <div class="peopleCardRight">
                        <h4 class="peopleCardName">
                            <!-- Updated Link -->
                            <a href="actorDetails.html?people=${people.id}&name=${people.name}">
                                ${people.name}
                            </a>
                        </h4>
                    </div>
                </div>
            `).join('');
    }

    // Update Pagination UI
    function updatePagination(current, total) {
        currentPage.textContent = current;
        totalPages.textContent = total;

        prevPage.classList.toggle("hide", current === 1);
        nextPage.classList.toggle("hide", current === total);
    }

    // Setup "Go To Page" Dropdown
    function setupGotoPage(totalPagesCount) {
        pageDropdown.innerHTML = `
            <option value="">Goto page</option>
            ${Array.from({ length: totalPagesCount }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
        `;

        pageDropdown.addEventListener("change", () => {
            const selectedPage = pageDropdown.value;
            if (selectedPage) fetchPeople(Number(selectedPage));
        });
    }

    // Next and Previous Page Navigation
    nextPage.addEventListener("click", (e) => {
        e.preventDefault();
        const current = parseInt(currentPage.textContent, 10);
        fetchPeople(current + 1);
    });

    prevPage.addEventListener("click", (e) => {
        e.preventDefault();
        const current = parseInt(currentPage.textContent, 10);
        fetchPeople(current - 1);
    });

    // Show/Hide Overlay
    function toggleOverlay(show) {
        overlay.style.display = show ? "flex" : "none";
    }

    // Scroll to Top of Page
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Utility: Replace URL Base
    function replaceUrl(url, name) {
        const oldBaseUrl = './public/upload/thumb/';
        const newBaseUrl = 'http://localhost/movie/api/public/upload/thumb/';
        return url.includes(oldBaseUrl)
            ? `<img src="${url.replace(oldBaseUrl, newBaseUrl)}" alt="${name}" class="movieListPoster">`
            : url;
    }

    // Utility: Generate Star Ratings
    function stars(rating) {
        const [fullStars, halfStar] = rating.toString().split(".").map(Number);
        const full = Array(fullStars).fill('<div class="starRating full"></div>').join('');
        const half = halfStar ? '<div class="starRating half"></div>' : '';
        return full + half;
    }
});
