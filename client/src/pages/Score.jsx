import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";

function Score() {
  const location = useLocation();
  const navigate = useNavigate();

  const quiz = location.state?.quiz || [];
  const userAnswers = location.state?.userAnswers || [];

  let correctAnswers = 0;

  quiz.forEach((question, index) => {
    if (userAnswers[index] === question.answer) {
      correctAnswers++;
    }
  });

  const wrongAnswers = quiz.length - correctAnswers;

  const percentage =
    quiz.length > 0
      ? Math.round((correctAnswers / quiz.length) * 100)
      : 0;

  const handleReviewAnswers = () => {
    navigate("/review", {
      state: {
        quiz: quiz,
        userAnswers: userAnswers
      }
    });
  };

  const handleGenerateNewQuiz = () => {
    navigate("/generate");
  };

  if (quiz.length === 0) {
    return (
      <div className="app">
        <div className="quiz-container">
          <h2>No quiz results found.</h2>

          <button
            className="generate-button"
            onClick={handleGenerateNewQuiz}
          >
            Generate a Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="quiz-container score-page">

        <div className="top-header"><h1>Quiz Completed !</h1><p className="emoji">🎉</p></div>

        <div className="score-display">
          <h2>
           Total Score: {correctAnswers} / {quiz.length}
          </h2>

          <h3>percentage: {percentage}%</h3>
        </div>

        <div className="score-details">

          <p>
            <strong>Correct Answers :</strong>{" "}
            {correctAnswers}
          </p>

          <p>
            <strong>Wrong Answers :</strong>{" "}
            {wrongAnswers}
          </p>

        </div>

        <button
          className="review-button"
          onClick={handleReviewAnswers}
        >
          Review Answers
        </button>

        <button
          className="generate-button"
          onClick={handleGenerateNewQuiz}
        >
          Generate New Quiz
        </button>

      </div>
    </div>
  );
}

export default Score;