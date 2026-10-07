const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

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


// ===============================
// GEMINI RETRY FUNCTION
// ===============================

async function generateQuizWithRetry(prompt, maxRetries = 3) {

  for (let attempt = 0; attempt <= maxRetries; attempt++) {

    try {

      console.log(`Gemini attempt ${attempt + 1}/${maxRetries + 1}`);

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt
      });

      return response;

    } catch (error) {

      console.error(
        `Gemini attempt ${attempt + 1} failed:`,
        error.message
      );

      // Check whether this is a temporary server/rate-limit error
      const errorText = error.message || "";

      const isRetryable =
        errorText.includes("503") ||
        errorText.includes("UNAVAILABLE") ||
        errorText.includes("429") ||
        errorText.includes("RESOURCE_EXHAUSTED");

      // If it is not a temporary error, don't retry
      if (!isRetryable) {
        throw error;
      }

      // If this was the final attempt, throw the error
      if (attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff
      const delay = 1000 * Math.pow(2, attempt);

      console.log(
        `Retrying Gemini in ${delay / 1000} seconds...`
      );

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}


// ===============================
// GENERATE QUIZ
// ===============================

app.post("/api/generate-quiz", async (req, res) => {

  try {

    const {
      topic,
      difficulty,
      questionCount
    } = req.body;

    // Basic validation
    if (!topic || !difficulty || !questionCount) {
      return res.status(400).json({
        error: "Topic, difficulty and question count are required."
      });
    }

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

    // Call Gemini with retry logic
    const response = await generateQuizWithRetry(prompt);

    const quiz = JSON.parse(response.text);

    res.json({
      quiz: quiz
    });

  } catch (error) {

    console.error("Final Gemini Error:", error);

    const errorText = error.message || "";

    // Give frontend a proper status code
    if (
      errorText.includes("503") ||
      errorText.includes("UNAVAILABLE")
    ) {

      return res.status(503).json({
        error:
          "Gemini AI is temporarily unavailable. Please try again in a few seconds."
      });
    }

    if (
      errorText.includes("429") ||
      errorText.includes("RESOURCE_EXHAUSTED")
    ) {

      return res.status(429).json({
        error:
          "Too many requests. Please wait a moment and try again."
      });
    }

    res.status(500).json({
      error: "Failed to generate quiz. Please try again."
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});