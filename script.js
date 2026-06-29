const csvUrl =
  "https://docs.google.com/spreadsheets/d/10seFGmZRvl6N88XZ5AY5JujcR4TEzEBw78J1VkvD0Vk/export?format=csv&gid=1951960072";

const cardsPerPage = 30;

const ADMIN_PASSWORD = "scalper";

const easterEggImages = [

    "https://cdn.discordapp.com/attachments/1166595568496287765/1517611981710950621/IMG_1866.jpg?ex=6a36e9cc&is=6a35984c&hm=0b4fd7268521f04b1239a0967249be5d73b330a921ebfdd12ab8c7aa753c1c62&",

    "https://cdn.discordapp.com/attachments/753479605960179724/1517539428434710680/IMG_1841.jpg?ex=6a36a63a&is=6a3554ba&hm=a5253dbcc514217feb6799244c5f817c917f7df8eb8bc87644d19ef0dba29abe&",

    "https://cdn.discordapp.com/attachments/753479605960179724/1517536779916411020/IMG_6970.jpg?ex=6a36a3c2&is=6a355242&hm=81352abfc636b9018a4f70602f64de798c24fcc72966476de4c72abd29e1bb0a&"

];

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

    function createPagination(container) {

        // Previous button
        const prevBtn = document.createElement("button");
        prevBtn.textContent = "← Previous";
        prevBtn.disabled = currentPage === 1;

        prevBtn.onclick = () => {
            currentPage--;
            renderCards();
        };

        container.appendChild(prevBtn);

        // Page text
        const pageText = document.createElement("span");
        pageText.textContent = " Page ";
        container.appendChild(pageText);

        // Dropdown
        const select = document.createElement("select");

        for (let i = 1; i <= totalPages; i++) {

            const option = document.createElement("option");
            option.value = i;
            option.textContent = i;

            if (i === currentPage) {
                option.selected = true;
            }

            select.appendChild(option);
        }

        select.addEventListener("change", () => {

            currentPage = Number(select.value);
            renderCards();

        });

        container.appendChild(select);

        // "of X"
        const totalText = document.createElement("span");
        totalText.textContent = ` of ${totalPages} `;
        container.appendChild(totalText);

        // Next button
        const nextBtn = document.createElement("button");
        nextBtn.textContent = "Next →";
        nextBtn.disabled = currentPage === totalPages;

        nextBtn.onclick = () => {

            currentPage++;
            renderCards();

        };

        container.appendChild(nextBtn);
    }

    createPagination(top);
    createPagination(bottom);
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
            <img src="${card.imageUrl}" loading="lazy">
            <h2>${card.cardName}</h2>
            <p>Condition: ${card.condition}</p>
            <p>Price: ${card.stickerPrice}</p>
        `;

        cardsDiv.appendChild(cardDiv);

        cardDiv.addEventListener("click", () => {

            document.getElementById("viewerImage").src =
                card.imageUrl;

            document.getElementById("viewerName").textContent =
                card.cardName;

            document.getElementById("viewerCondition").textContent =
                "Condition: " + card.condition;

            document.getElementById("viewerPrice").textContent =
                "Price: " + card.stickerPrice;

            document.getElementById("cardViewer").style.display = "flex";

        });

    });   // closes forEach

    renderPagination();

}   // closes renderCards

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
            const condition = row[2]?.trim() || "NM";
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
        
        document.getElementById("loadingOverlay").style.display = "none";
    }
});

document
    .getElementById("searchInput")
    .addEventListener("input", applyFilters);

document
    .getElementById("sortSelect")
    .addEventListener("change", applyFilters);

const adminButton = document.getElementById("adminButton");


adminButton.addEventListener("click", () => {

    const password = prompt("Enter admin password:");

    if (password === ADMIN_PASSWORD) {

        const overlay = document.getElementById("easterEggOverlay");
        const image = document.getElementById("easterEggImage");
        
        overlay.style.display = "flex";
        

        let delay = 90;
        let spinCount = 0;
        const maxSpins = 12;
        
        function spinImage() {
        
            const randomIndex =
                Math.floor(Math.random() * easterEggImages.length);
        
            image.src = easterEggImages[randomIndex];
        
            spinCount++;
        
            if (spinCount < maxSpins) {
        
                // Only slow down at the very end
                if (spinCount >= maxSpins - 2) {
                    delay = 180;
                }
        
                setTimeout(spinImage, delay);
        
            } else {
        
                const finalIndex =
                    Math.floor(Math.random() * easterEggImages.length);
        
                image.src = easterEggImages[finalIndex];
        
            }
        
        }
        
        spinImage();




    } else {

        alert("Incorrect password.");

    }

});


document
    .getElementById("easterEggOverlay")
    .addEventListener("click", () => {

        document.getElementById("easterEggOverlay").style.display = "none";

    });


document
    .getElementById("cardViewer")
    .addEventListener("click", () => {

        document.getElementById("cardViewer").style.display = "none";

    });
