const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization:
            "Bearer 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",
          "Content-Type": "application/json",
          "HTTP-Referer": "https://calm-mind-bot-2.onrender.com/",
          "X-Title": "CalmBot",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b:free",
          messages: [
            {
              role: "system",
              content:
                "You are a calm, friendly assistant that comforts users and gives positive support.",
            },
            { role: "user", content: userMessage },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log(data); // 👈 IMPORTANT (to see errors in terminal)

    res.json(data);
  } catch (err) {
    console.log(err);
    res.json({ error: "API failed" });
  }
});

app.listen(3001, () => console.log("Server running"));

