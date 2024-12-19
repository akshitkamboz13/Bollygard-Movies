$(document).ready(function () {
    async function initializeVisitorData() {
        try {
            await createVisitor();
            const totalVisitors = await getVisitorCount();
            console.log("Total visitors count:", totalVisitors);
            setTimeout(() => counter(totalVisitors), 500);
        } catch (error) {
            console.error("Error initializing visitor data:", error);
        }
    }

    initializeVisitorData();
});

async function createVisitor() {
    try {
        const response = await $.ajax({
            url: "https://bollygradmovies.com/api/visitor/",
            method: "POST",
        });
        console.log("Visitor created:", response);
    } catch (error) {
        throw new Error("Error creating visitor count:", error);
    }
}

async function getVisitorCount() {
    try {
        const response = await $.ajax({
            url: "https://bollygradmovies.com/api/visitor/1",
            method: "GET",
        });
        
        if (response?.response?.[0]) {
            return response.response[0].total;
        } else {
            throw new Error("Invalid response format or data");
        }
    } catch (error) {
        throw new Error("Error fetching visitor count:", error);
    }
}

function counter(visitor) {
    const visitedBy = document.querySelector("#nFVisitor");
    let start = 0;
    const duration = 3000; // total duration in ms
    const interval = 20; // interval duration in ms
    const increment = visitor / (duration / interval); // calculate increment step

    const counterInterval = setInterval(() => {
        visitedBy.innerHTML = Math.floor(start);
        if (start >= visitor) {
            clearInterval(counterInterval);
            triggerAnimations();
        }
        start += increment;
    }, interval);
}

function triggerAnimations() {
    const from = document.querySelector(".from");
    const vis = document.querySelector(".vis");
    const count = document.querySelector(".count");

    from.classList.add("downAnimation");
    vis.classList.add("upAnimation");
    count.classList.remove("minHeightOnCount");

    const focusDiv = document.querySelector('.visitContainer');
    focusDiv.addEventListener('focus', () => {
        from.classList.add("downAnimation");
        vis.classList.add("upAnimation");
        count.classList.remove("minHeightOnCount");
    });
}
