import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import GenerateQuiz from "./pages/GenerateQuiz";
import Quiz from "./pages/Quiz";
import Score from "./pages/Score";
import ReviewAnswers from "./pages/ReviewAnswers";
import Loading from "./pages/Loading";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/generate" />} />

        <Route path="/generate" element={<GenerateQuiz />} />

        <Route path="/loading" element={<Loading />} />

        <Route path="/quiz" element={<Quiz />} />

        <Route path="/score" element={<Score />} />

        <Route path="/review" element={<ReviewAnswers />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;