const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/generate-resume", async (req, res) => {
  const { name, jobTitle, skills, experience } = req.body;

  const prompt = `
Create a professional resume for the following person:

Name: ${name}
Job Title: ${jobTitle}
Skills: ${skills}
Experience: ${experience}

Use a clean, professional tone. List name, summary, experience, skills, and education.
  `;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
    });

    const resume = completion.choices[0].message.content;
    res.json({ resume });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate resume" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});