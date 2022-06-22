const defDisplay = document.querySelector("#definition-display");
var score;
var streak;

async function getTerms() {
    let req = await fetch("https://api.urbandictionary.com/v0/random");
    let res = await req.json();
    let list = res.list;

    list = list.filter(term => !term.definition.toLowerCase().includes(term.word.toLowerCase()));
    list = list.map(term => {
        term.definition = term.definition
            .split("[")
            .join("")
            .split("]")
            .join("");
        term.example = term.example
            .split("[")
            .join("")
            .split("]")
            .join("");
        return term;
    })

    return list.length >= 4 ? list : getTerms();
}

window.onload = async _ => {
    score = localStorage.getItem("score") || 0;
    streak = localStorage.getItem("streak") || 0;
    document.querySelector("#score-display").innerText = score + " ⚡";
    document.querySelector("#streak-display").innerText = streak + " 🔥";

    document.querySelector("#example-display").innerText = "";
    let i = Math.floor(Math.random() * 4)

    let terms = await getTerms();
    let word = terms[i].word;
    defDisplay.innerText = terms[i].definition;

    if (terms[i].example && score >= 5) {
        document.querySelector("#show-example").style.display = "block";
        document.querySelector("#example-display").innerText = terms[i].example;
        (function(term) {
            document.querySelector("#show-example").onclick = _ => {
                document.querySelector("#example-display").classList.add('show');
                document.querySelector("#show-example").style.display = "none";
                score -= 5;
                document.querySelector("#score-display").innerText = score + " ⚡";
            };
        })(terms[i]);
    }

    let correctButton;
    for (let button of Array.from(document.querySelectorAll("#options button"))) {
        button.innerText = terms[0].word;

        button.addEventListener('click', e => {
            if (e.target.innerText == word) {
                e.target.classList.add("correct");
                score++;
                streak++;
            } else {
                e.target.classList.add("incorrect");
                correctButton.classList.add("correct");
                score--;
                streak = 0;
            }

            localStorage.setItem("score", score);
            localStorage.setItem("streak", streak);
            document.querySelector("#score-display").innerText = score + " ⚡";
            document.querySelector("#streak-display").innerText = streak + " 🔥";

            setTimeout(_ => location.reload(), 2000);
        });

        terms.splice(0, 1);
        if (button.innerText == word) { correctButton = button }
    }
}