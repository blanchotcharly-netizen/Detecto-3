export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Méthode non autorisée" });
    }

    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: "Texte manquant." });
    }

    try {
        const response = await fetch("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "sonar",
                messages: [
                    {
                        role: "system",
                        content:
                            "Analyse ce texte journalistique et renvoie un JSON strict : {\"commentaire\":\"...\",\"score\":X} où score = 0 à 100."
                    },
                    { role: "user", content: text }
                ]
            })
        });

        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;

        let parsed;
        try {
            parsed = JSON.parse(content);
        } catch {
            return res.status(500).json({ error: "Réponse invalide de l’IA." });
        }

        res.status(200).json(parsed);

    } catch (error) {
        console.error("Erreur API Perplexity :", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
}

