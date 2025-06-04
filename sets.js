window.addEventListener('DOMContentLoaded', function () {
    //get the elements using the DOM
    let btnAskSet = document.getElementById("btnAskSet");
    let setInput = this.document.getElementById("setInp");
    let setImg = this.document.getElementById("setImg");
    let divInfoSet = this.document.getElementById("setInfo");
    let inputName;

    let globalData;

    //event to listen to the button
    btnAskSet.addEventListener('click', askSet);
    setInput.addEventListener("keyup", ({ key }) => {
        if (key === "Enter") {
            askSet();
        }
    })

    function askSet() {
        inputName = setInput.value;
        cardId = 0;

        fetch("https://api.pokemontcg.io/v2/sets?q=name:" + inputName,
            {
                headers: { "X-Api-Key": "39937099-87b7-425f-b19d-bad8442bc588" }
            }).then(function (res) {
                console.log(res.status);
                if (!res.ok) {
                    throw new Error("Set not found");
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
                divInfoSet.innerHTML = "<p>No Set found.</p>";
                setImg.src = "";
                return;
            }
        }

        let urlImg = card.images.logo;
        let name = card.name;
        let series = card.series;
        let totalCards = card.printedTotal;
        let releaseDate = card.releaseDate;

        setImg.src = urlImg;

        divInfoSet.innerHTML = `
                <p><strong>Name: </strong>${name}</p>
                <p><strong>Series: </strong>${series}</p>
                <p><strong>Total Cards: </strong>${totalCards}</p>
                <p><strong>ReleaseDate: </strong>${releaseDate}</p>
            `;
    }
}
)