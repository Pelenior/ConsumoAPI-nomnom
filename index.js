window.addEventListener('DOMContentLoaded', function () {
    //get the elements using the DOM
    let btnAsk = document.getElementById("btnAsk");
    let btnNext = this.document.getElementById("btnNext");
    let btnPrev = this.document.getElementById("btnPrev");
    let cardInput = this.document.getElementById("cardInp");
    let cardImg = this.document.getElementById("cardImg");
    let divInfo = this.document.getElementById("cardInfo");
    let divCounter = this.document.getElementById("counterDiv");
    let cardName;

    let globalData;
    let cardId = 0;

    //event to listen to the button
    btnAsk.addEventListener('click', askCard);
    btnPrev.addEventListener('click', prevCard);
    btnNext.addEventListener('click', nextCard);
    cardInput.addEventListener("keyup", ({ key }) => {
        if (key === "Enter") {
            askCard();
        }
    })

    function askCard() {
        cardName = cardInput.value;
        cardId = 0;

        fetch("https://api.pokemontcg.io/v2/cards?q=name:" + cardName,
            {
                headers: { "X-Api-Key": "39937099-87b7-425f-b19d-bad8442bc588" }
            }).then(function (res) {
                console.log(res.status);
                if (!res.ok) {
                    throw new Error("Pokémon not found");
                }

                return res.json();
            }).then(function (data) {
                globalData = data;
                console.log(globalData);
                showData(globalData);
            }).catch(function (error) {
                console.log(error);
            })
    }

    function showData(data) {
        if (cardId == -1) {
            console.log("id -1 not valid, trying to go to id: " + (data.data.length - 1));
            cardId = data.data.length - 1;
        }
        let card = data.data[cardId];

        //first error catch (in case you went over the limit by going to next or prev card)
        if (!card) {
            cardId = 0;
            card = data.data[cardId];
            //second error catch (wrong input name, pokemon doesn't exist)
            if (!card) {
                divInfo.innerHTML = "<p>No card found.</p>";
                cardImg.src = "";
                return;
            }
        }

        let urlImg = card.images.large;
        let name = card.name;
        let artist = card.artist;

        let cardmarket = "https://www.cardmarket.com/es/Pokemon";
        if (card.cardmarket?.url)//only if cardmarket exists
        {
            cardmarket = card.cardmarket.url;
        }
        let legalities = card.legalities.unlimited;

        cardImg.src = urlImg;

        let setName = card.set.name;
        let setImage = card.set.images.logo;

        let totalCards = data.data.length;

        divCounter.innerHTML = `<p>${cardId + 1}/${totalCards}</p>`;

        let priceHTML = '';
        if (card.cardmarket?.prices) {
            const prices = card.cardmarket.prices;

            if (prices.avg1 !== undefined) {
                priceHTML += `<p><strong>Average:</strong> €${prices.avg1}</p>`;
            }

            if (prices.reverseHoloAvg1 !== undefined && prices.reverseHoloAvg1 !== 0) {
                priceHTML += `<p><strong>ReverseHolo Average:</strong> €${prices.reverseHoloAvg1}</p>`;
            }
        }
        else if (card.tcgplayer?.prices) {
            Object.entries(card.tcgplayer.prices).forEach(([type, priceData]) => {
                if (priceData.mid !== undefined) {
                    priceHTML += `<p><strong>${type} Mid Price:</strong> $${priceData.mid}</p>`;
                }
            });
        }


        if (card.supertype == "Pokémon") {
            let hp = card.hp;
            let mainType = card.types[0];

            divInfo.innerHTML = `
                <p style="margin-top:10px;"><strong>Name: </strong>${name}</p>
                <p><strong>HP: </strong>${hp}</p>
                <p><strong>Main Type: </strong>${mainType}</p>
                <p><strong>Artist: </strong>${artist}</p>
                ${priceHTML}
                <p><strong>CardMaket: </strong><a href="${cardmarket}" class="cardmarket" style="text-decoration: none;" target="_blank"> Link</a></p>
                <p><strong>Legality: </strong>${legalities}</p>
                <p><strong>Set: </strong>${setName}</p>
                <img src="${setImage}" width="80%"></img>
            `;
        }
        else {
            divInfo.innerHTML = `
                <p style="margin-top:10px;"><strong>Name: </strong>${name}</p>
                <p><strong>Artist: </strong>${artist}</p>
                ${priceHTML}
                <a href="${cardmarket}" class="cardmarket" style="text-decoration: none;" target="_blank"><strong>CardMaket: </strong> Link</a>
                <p><strong>Legality: </strong>${legalities}</p>
                <p><strong>Set: </strong>${setName}</p>
                <img src="${setImage}" width="80%"></img>
            `;
        }


    }
    function prevCard() {
        cardId -= 1;
        showData(globalData);
    }
    function nextCard() {
        cardId += 1;
        showData(globalData);
    }
}
)