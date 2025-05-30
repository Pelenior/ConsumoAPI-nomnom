window.addEventListener('DOMContentLoaded', function()
{
    //get the elements using the DOM
    let btnAsk = document.getElementById("btnAsk");
    let btnNext = this.document.getElementById("btnNext");
    let cardInput = this.document.getElementById("cardInp");
    let cardImg = this.document.getElementById("cardImg");
    let divInfo = this.document.getElementById("cardInfo");
    let cardName;

    let globalData;
    let cardId = 0;

    //event to listen to the button
    btnAsk.addEventListener('click', askCard);
    btnPrev.addEventListener('click', prevCard);
    btnNext.addEventListener('click', nextCard);
    cardInput.addEventListener("keyup", ({key}) =>
    {
        if (key === "Enter")
            {
                askCard();
            }
    })

    function askCard()
    {
        if(cardName == cardInput.value)
        {
            console.log("Same search, not consuming API");
            return;
        }
        cardName = cardInput.value;
        cardId = 0;

        fetch("https://api.pokemontcg.io/v2/cards?q=name:" + cardName,
        {
            headers: { "X-Api-Key": "39937099-87b7-425f-b19d-bad8442bc588" }
        }).then(function(res)
        {
            console.log(res.status);
            if(!res.ok)
            {
                throw new Error("Pokémon not found");
            }

            return res.json();
        }).then(function(data)
        {
            globalData = data;
            console.log(globalData);
            showData(globalData);
        }).catch(function(error)
        {
            console.log(error);
        })
    }

    function showData(data)
    {
        if(cardId == -1)
        {
            console.log("id -1 not valid, trying to go to id: " + (data.data.length - 1));
            cardId = data.data.length - 1;
        }
        let card = data.data[cardId];

        //first error catch (in case you went over the limit by going to next or prev card)
        if (!card)
        {
            cardId = 0;
            card = data.data[cardId];
            //second error catch (wrong input name, pokemon doesn't exist)
            if(!card)
            {
                divInfo.innerHTML = "<p>No card found.</p>";
                cardImg.src = "";
                return;
            }
        }

        let urlImg = card.images.large;
        let name = card.name.toUpperCase();

        cardImg.src = urlImg;

        let setName = card.set.name;
        let setImage = card.set.images.logo;

        if(card.supertype == "Pokémon")
        {
            let hp = card.hp;
            let mainType = card.types[0];

            divInfo.innerHTML = `
                <p><strong>Name: ${name}</strong></p>
                <p><strong>HP: ${hp}</strong></p>
                <p><strong>Main Type: ${mainType}</strong></p>
                <p><strong>Set: ${setName}</strong></p>
                <img src="${setImage}" width="80%"></img>
            `;
        }
        else if(card.supertype == "Trainer")
        {
            divInfo.innerHTML = `
                <p><strong>Name: ${name}</strong></p>
                <p><strong>Set: ${setName}</strong></p>
                <img src="${setImage}" width="80%"></img>
            `;
        }

        
    }
    function prevCard()
    {
        cardId -= 1;
        showData(globalData);
    }
    function nextCard()
    {
        cardId += 1;
        showData(globalData);
    }
}
)