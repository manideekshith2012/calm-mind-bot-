const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Chatbot server is running!");
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.OPENROUTER_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b:free",
        messages: [
          {
            role: "system",
            content: "You are a calm, friendly assistant who reduces stress and speaks positively."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    console.log(data); // IMPORTANT: shows errors in Render logs

    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't reply.";

    res.json({ reply });

  } catch (err) {
    console.log(err);
    res.json({ reply: "Server error" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
