import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";

function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();

  const quiz = location.state?.quiz || [];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  // If quiz data is missing
  if (quiz.length === 0) {
    return (
      <div className="app">
        <div className="quiz-container">
          <h2>No quiz found</h2>
          <button
            className="generate-button"
            onClick={() => navigate("/generate")}
          >
            Generate a Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQuizQuestion = quiz[currentQuestion];

  const handleSelectAnswer = (option) => {
    setSelectedAnswer(option);

    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestion] = option;

    setUserAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (!selectedAnswer) {
      alert("Please select an answer.");
      return;
    }

    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);

      setSelectedAnswer(
        userAnswers[currentQuestion + 1] || ""
      );
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);

      setSelectedAnswer(
        userAnswers[currentQuestion - 1] || ""
      );
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswer) {
      alert("Please select an answer.");
      return;
    }

    navigate("/score", {
      state: {
        quiz: quiz,
        userAnswers: userAnswers
      }
    });
  };

  return (
    <div className="app">
      <div className="quiz-container">

        <h1>QuizPilot AI</h1>

        <h2 className="question">
          Question {currentQuestion + 1} / {quiz.length}
        </h2>

        <div className="question-card">

          <h3>
            {currentQuestion + 1}. {currentQuizQuestion.question}
          </h3>

          <div className="options">

            {currentQuizQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(option)}
                className={
                  selectedAnswer === option
                    ? "selected-option"
                    : ""
                }
              >
                {option}
              </button>
            ))}

          </div>

        </div>

        <div className="navigation-buttons">

          <button
            className="previous-button"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            ← Previous
          </button>

          {currentQuestion === quiz.length - 1 ? (
            <button
              className="submit-button"
              onClick={handleSubmit}
            >
              Submit Quiz
            </button>
          ) : (
            <button
              className="next-button"
              onClick={handleNext}
            >
              Next →
            </button>
          )}

        </div>

      </div>
    </div>
  );
}

export default Quiz;