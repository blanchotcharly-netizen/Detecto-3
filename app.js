const analyzeBtn = document.getElementById("analyzeBtn");
const loader = document.getElementById("loader");
const results = document.getElementById("results");
const output = document.getElementById("analysisOutput");

const gaugeFill = document.getElementById("gaugeFill");
const percentageLabel = document.getElementById("percentageLabel");

analyzeBtn.addEventListener("click", async () => {
    const text = document.getElementById("textInput").value.trim();
    if (!text) return alert("Entre un texte à analyser.");

    // UI — show loader
    loader.classList.remove("hidden");
    results.classList.add("hidden");

    try {
        const response = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });

        const data = await response.json();

        if (data.error) {
            alert("Erreur : " + data.error);
            loader.classList.add("hidden");
            return;
        }

        // Texte résultat
        output.textContent = data.commentaire;

        // Jauge
        updateGauge(data.score);

        // UI
        loader.classList.add("hidden");
        results.classList.remove("hidden");

    } catch (err) {
        console.error(err);
        alert("Erreur lors de l'analyse.");
        loader.classList.add("hidden");
    }
});


function updateGauge(score) {
    const safeScore = Math.min(Math.max(score, 0), 100);

    gaugeFill.style.width = safeScore + "%";

    // Dégradé vert → rouge
    const r = Math.floor((safeScore / 100) * 255);
    const g = Math.floor(255 - (safeScore / 100) * 255);
    gaugeFill.style.backgroundColor = `rgb(${r}, ${g}, 0)`;

    percentageLabel.textContent = safeScore + "% de tonalité connotée";
}
