import React, { useState } from "react";
import quizData from "../../data/frontend_quiz_200_questions.json";
import "./quiz.css";
import Navbar from "../../components/Navbar";
const Quiz = () => {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [count, setCount] = useState(5);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);

  const allCategories = Array.from(
    new Set(quizData.questions.map((q) => q.category))
  ).sort();

  const generateQuiz = () => {
  const filtered = quizData.questions.filter(
    (q) => q.category.toLowerCase() === selectedSkill.toLowerCase()
  );

  const seen = new Set();
  const uniqueFiltered = filtered.filter((q) => {
    if (seen.has(q.question)) return false;
    seen.add(q.question);
    return true;
  });

  const shuffled = uniqueFiltered.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count); // only same-topic

  setQuizQuestions(selected);
  setUserAnswers(Array(selected.length).fill(null));
};


  const handleOptionSelect = (qIndex, option) => {
    const updated = [...userAnswers];
    updated[qIndex] = option;
    setUserAnswers(updated);
  };

  const isCorrect = (index) =>
    userAnswers[index] === quizQuestions[index].answer;

  return (
    <>
    <Navbar />
    <div className="quiz-container">
      <h1>AI Quiz Generator</h1>
      <p>Generate custom interview questions based on your requirements</p>

      <div className="quiz-inputs">
        <div>
          <label>Company Name</label>
          <input value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>
        <div>
          <label>Job Role</label>
          <input value={role} onChange={(e) => setRole(e.target.value)} />
        </div>
        <div>
          <label>Select Topic</label>
          <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)}>
            <option value="">-- Select a topic --</option>
            {allCategories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="slider-field">
          <label>Number of Questions: {count}</label>
          <input
            type="range"
            min="1"
            max="20"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
          />
        </div>
        <button onClick={generateQuiz} disabled={!selectedSkill}>
          Generate Quiz
        </button>
      </div>

      {quizQuestions.length > 0 && (
        <div className="quiz-section">
          <h2>Quiz Questions</h2>
          {quizQuestions.map((q, index) => (
            <div key={index} className="question-block">
              <h4>
                Q{index + 1}: {q.question}
                {q.category && <span className="category"> ({q.category})</span>}
              </h4>
              {q.options.map((option, i) => (
                <button
                  key={i}
                  className={`option-btn ${
                    userAnswers[index]
                      ? option === q.answer
                        ? "correct"
                        : option === userAnswers[index]
                        ? "wrong"
                        : ""
                      : ""
                  }`}
                  disabled={userAnswers[index]}
                  onClick={() => handleOptionSelect(index, option)}
                >
                  {option}
                </button>
              ))}
              {userAnswers[index] && (
                <p className={isCorrect(index) ? "correct-text" : "wrong-text"}>
                  {isCorrect(index)
                    ? "✅ Correct!"
                    : `❌ Incorrect. Answer: ${q.answer}`}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    </>
    
  );
};

export default Quiz;
