document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const text = document.getElementById("inputText").value;

    const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });

    const data = await response.json();

    document.getElementById("results").classList.remove("hidden");

    document.getElementById("neutralityScore").textContent = data.neutrality;

    fillList("biasList", data.biases);
    fillList("connotationList", data.connotations);
    fillList("sourceList", data.sources);
    fillList("frameList", data.frames);
});

function fillList(id, items) {
    const ul = document.getElementById(id);
    ul.innerHTML = "";
    items.forEach(i => {
        const li = document.createElement("li");
        li.textContent = i;
        ul.appendChild(li);
    });
}

