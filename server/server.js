const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.get("/", (req, res) => {
  res.send("QuizPilot AI Backend is Running!");
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "QuizPilot AI API is working!"
  });
});

app.post("/api/generate-quiz", async (req, res) => {
  try {
    const { topic, difficulty, questionCount } = req.body;

    const prompt = `
Generate ${questionCount} multiple-choice quiz questions about ${topic}.

Difficulty level: ${difficulty}

Each question must have:
- question
- exactly 4 options
- correct answer
- explanation

The explanation should clearly explain why the correct answer is correct.
Keep the explanation simple and educational so that a student can understand the concept.

Return the result as a JSON array.

The JSON must follow this exact format:

[
  {
    "question": "Question text",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "answer": "Correct option text",
    "explanation": "A clear and simple explanation of why the correct answer is correct."
  }
]

Important rules:
- Return exactly ${questionCount} questions.
- Each question must have exactly 4 options.
- The answer must exactly match one of the option texts.
- The explanation must explain the concept behind the correct answer.
- Do not include markdown.
- Do not include any text outside the JSON.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt
    });

    const quiz = JSON.parse(response.text);

    res.json({
      quiz: quiz
    });

  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});