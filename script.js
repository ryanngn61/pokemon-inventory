const csvUrl =
  "https://docs.google.com/spreadsheets/d/10seFGmZRvl6N88XZ5AY5JujcR4TEzEBw78J1VkvD0Vk/export?format=csv&gid=1951960072";

const cardsPerPage = 60;

const ADMIN_PASSWORD = "scalper";

let adminMode = false;

let allCards = [];
let filteredCards = [];
let currentPage = 1;

function parsePrice(priceString) {
    return parseFloat(priceString.replace("$", "").replace(",", "")) || 0;
}

function renderPagination() {
    const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

    const top = document.getElementById("topPagination");
    const bottom = document.getElementById("bottomPagination");

    top.innerHTML = "";
    bottom.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const topBtn = document.createElement("button");
        topBtn.textContent = i;
        topBtn.onclick = () => {
            currentPage = i;
            renderCards();
        };

        const bottomBtn = document.createElement("button");
        bottomBtn.textContent = i;
        bottomBtn.onclick = () => {
            currentPage = i;
            renderCards();
        };

        top.appendChild(topBtn);
        bottom.appendChild(bottomBtn);
    }
}

function renderCards() {
    const cardsDiv = document.getElementById("cards");
    cardsDiv.innerHTML = "";

    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;

    filteredCards.slice(start, end).forEach(card => {

        const cardDiv = document.createElement("div");
        cardDiv.className = "card";

        cardDiv.innerHTML = `
            <img src="${card.imageUrl}">
            <h2>${card.cardName}</h2>
            <p>Condition: ${card.condition}</p>
            <p>Price: ${card.stickerPrice}</p>

            ${
                adminMode
                    ? `<button class="soldButton">Mark Sold</button>`
                    : ""
            }
        `;

        cardsDiv.appendChild(cardDiv);
    });

    renderPagination();
}

function applyFilters() {

    const searchText =
        document.getElementById("searchInput").value.toLowerCase();

    const sortValue =
        document.getElementById("sortSelect").value;

    filteredCards = allCards.filter(card =>
        card.cardName.toLowerCase().includes(searchText)
    );

    if (sortValue === "high") {
        filteredCards.sort(
            (a, b) => parsePrice(b.stickerPrice) - parsePrice(a.stickerPrice)
        );
    }

    if (sortValue === "low") {
        filteredCards.sort(
            (a, b) => parsePrice(a.stickerPrice) - parsePrice(b.stickerPrice)
        );
    }

    if (sortValue === "alpha") {
        filteredCards.sort(
            (a, b) => a.cardName.localeCompare(b.cardName)
        );
    }

    currentPage = 1;
    renderCards();
}

Papa.parse(csvUrl, {
    download: true,
    complete: function(results) {

        results.data.slice(1).forEach(row => {

            const cardName = row[0];
            const condition = row[2];
            const stickerPrice = row[4];
            const tcgLink = row[6];
            const inStock = row[7];

            if (
                inStock &&
                inStock.trim().toUpperCase() === "TRUE"
            ) {

                const productId =
                    tcgLink.match(/product\/(\d+)/)?.[1];

                const imageUrl =
                    `https://tcgplayer-cdn.tcgplayer.com/product/${productId}_in_1000x1000.jpg`;

                allCards.push({
                    cardName,
                    condition,
                    stickerPrice,
                    imageUrl
                });
            }

        });

        filteredCards = [...allCards];
        renderCards();
    }
});

document
    .getElementById("searchInput")
    .addEventListener("input", applyFilters);

document
    .getElementById("sortSelect")
    .addEventListener("change", applyFilters);

const adminButton = document.getElementById("adminButton");
const exitAdminButton = document.getElementById("exitAdminButton");

adminButton.addEventListener("click", () => {

    const password = prompt("Enter admin password:");

    if (password === ADMIN_PASSWORD) {

        adminMode = true;

        adminButton.style.display = "none";
        exitAdminButton.style.display = "inline-block";

        renderCards();

        alert("Admin mode enabled.");

    } else {

        alert("Incorrect password.");

    }

});

exitAdminButton.addEventListener("click", () => {

    adminMode = false;

    adminButton.style.display = "inline-block";
    exitAdminButton.style.display = "none";

    renderCards();

});
