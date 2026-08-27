import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";

function ReviewAnswers() {
  const location = useLocation();
  const navigate = useNavigate();

  const quiz = location.state?.quiz || [];
  const userAnswers = location.state?.userAnswers || [];

  if (quiz.length === 0) {
    return (
      <div className="app">
        <div className="quiz-container">

          <h2>No quiz answers found.</h2>

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

  return (
    <div className="app">
      <div className="quiz-container review-page">

        <h1>Review Answers</h1>

        <p className="subtitle">
          Review your answers and understand the concepts better 😊!
        </p>

        {quiz.map((question, index) => {

          const userAnswer = userAnswers[index];
          const correctAnswer = question.answer;

          const isCorrect = userAnswer === correctAnswer;

          return (
            <div
              className="review-card"
              key={index}
            >

              <h2>
                Question {index + 1}
              </h2>

              <h3>
               {question.question}
              </h3>

              <p>
                <strong>Your Answer:</strong>{" "}
                <span
                  className={
                    isCorrect
                      ? "correct-answer"
                      : "wrong-answer"
                  }
                >
                  {userAnswer || "Not answered"}
                </span>
              </p>

              <p>
                <strong>Correct Answer:</strong>{" "}
                <span className="correct-answer">
                  {correctAnswer}
                </span>
              </p>

              <div className="explanation">

                <h4>💡 Why is this correct ?</h4>

                <p>
                  {question.explanation ||
                    `The correct answer is "${correctAnswer}" because it is the most appropriate answer for the question.`}
                </p>

              </div>

            </div>
          );
        })}

        <button
          className="generate-button"
          onClick={() => navigate("/generate")}
        >
          Generate New Quiz
        </button>

      </div>
    </div>
  );
}

export default ReviewAnswers;