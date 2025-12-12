export default async function handler(req, res) {
    try {
        const { text } = req.body;

        const response = await fetch("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "sonar-pro",  
                messages: [
                    {
                        role: "user",
                        content: `
Analyse journalistique de cet article :

${text}

Retourne un JSON strict :
{
  "neutrality": "score + justification",
  "biases": ["..."],
  "connotations": ["..."],
  "sources": ["..."],
  "frames": ["..."]
}
                        `
                    }
                ]
            })
        });

        const data = await response.json();
        const content = JSON.parse(data.choices[0].message.content);

        res.status(200).json(content);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur API" });
    }
}
