import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function GenerateQuiz() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionsCount, setQuestionsCount] = useState(5);

  const navigate = useNavigate();

  const handleGenerateQuiz = async () => {
    console.log("Generate Quiz button clicked");

    // Check topic
    if (!topic.trim()) {
      alert("Please enter a topic.");
      return;
    }

    // Check number of questions
    if (!questionsCount || questionsCount < 1) {
      alert("Please enter a valid number of questions.");
      return;
    }

    // Immediately move to Loading page
    navigate("/loading");

    try {
      // Send request to backend
      const response = await fetch(
        "http://localhost:5000/api/generate-quiz",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            topic: topic,
            difficulty: difficulty,
            questionCount: Number(questionsCount)
          })
        }
      );

      // Convert response to JSON
      const data = await response.json();

      console.log("Quiz data received:", data);

      // Check for backend error
      if (!response.ok) {
        throw new Error(
          data.error || "Failed to generate quiz."
        );
      }

      // Send generated quiz to Quiz page
      navigate("/quiz", {
        state: {
          quiz: data.quiz
        }
      });

    } catch (error) {
      console.error("Quiz Generation Error:", error);

      alert(
        error.message || "Failed to generate quiz."
      );

      // Return to Generate page if something goes wrong
      navigate("/generate");
    }
  };

  return (
    <div className="app">

      <div className="quiz-container">

        <h1>QuizPilot AI</h1>

        <p className="subtitle">
          AI-Powered Quiz Generator
        </p>

        {/* Topic */}

        <div className="form-group">

          <label>Topic</label>

          <input
            type="text"
            placeholder="Enter a topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

        </div>

        {/* Difficulty */}

        <div className="form-group">

          <label>Difficulty</label>

          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value)
            }
          >

            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>

          </select>

        </div>

        {/* Number of Questions */}

        <div className="form-group">

          <label>Number of Questions</label>

          <input
            type="number"
            min="1"
            max="20"
            value={questionsCount}
            onChange={(e) =>
              setQuestionsCount(
                parseInt(e.target.value)
              )
            }
            placeholder="Enter number of questions"
          />

        </div>

        {/* Generate Button */}

        <button
          className="generate-button"
          onClick={handleGenerateQuiz}
        >
          Generate Quiz
        </button>

      </div>

    </div>
  );
}

export default GenerateQuiz;