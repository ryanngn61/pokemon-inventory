const csvUrl =
  "https://docs.google.com/spreadsheets/d/10seFGmZRvl6N88XZ5AY5JujcR4TEzEBw78J1VkvD0Vk/export?format=csv&gid=1951960072";

fetch(csvUrl)
  .then(response => response.text())
  .then(data => {
    const rows = data.split("\n");
    const cardsDiv = document.getElementById("cards");

    // Skip header row
    rows.slice(1).forEach(row => {
      const cols = row.split(",");

      const cardName = cols[0];
      const condition = cols[2];
      const stickerPrice = cols[4];
      const inStock = cols[7];

      if (inStock.trim().toUpperCase() === "TRUE") {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
          <h2>${cardName}</h2>
          <p>Condition: ${condition}</p>
          <p>Price: $${stickerPrice}</p>
        `;

        cardsDiv.appendChild(card);
      }
    });
  });
