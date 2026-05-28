import { useState, useEffect, useCallback } from 'react';

export const useQuiz = (exam, onAutoSubmit) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizDurationLeft, setQuizDurationLeft] = useState(0);

  // Initialize quiz state when exam is loaded
  useEffect(() => {
    if (exam) {
      // Assuming exam.duration is in minutes
      setQuizDurationLeft(exam.duration * 60);
      setSelectedAnswers({});
      setFlaggedQuestions({});
      setCurrentQuestionIdx(0);
      setQuizFinished(false);
    }
  }, [exam]);

  const finishQuiz = useCallback(() => {
    if (quizFinished) return 0;
    
    setQuizFinished(true);
    let correctCount = 0;
    exam.questions.forEach((q, idx) => {
      // Use index if q.id is not available or q.answer
      const answer = q.answer !== undefined ? q.answer : q.correct;
      const questionKey = q.id !== undefined ? q.id : idx;
      
      if (selectedAnswers[questionKey] === answer) {
        correctCount++;
      }
    });
    return correctCount;
  }, [exam, selectedAnswers, quizFinished]);

  // Timer logic
  useEffect(() => {
    let timer;
    if (!quizFinished && quizDurationLeft > 0) {
      timer = setInterval(() => {
        setQuizDurationLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Trigger auto-submit
            if (onAutoSubmit) onAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizFinished, quizDurationLeft, onAutoSubmit]);

  const selectOption = (questionId, optionIdx) => {
    if (quizFinished) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const clearAnswer = (questionId) => {
    if (quizFinished) return;
    setSelectedAnswers(prev => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  const toggleFlag = (questionId) => {
    if (quizFinished) return;
    setFlaggedQuestions(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  return {
    currentQuestionIdx,
    setCurrentQuestionIdx,
    selectedAnswers,
    flaggedQuestions,
    quizFinished,
    quizDurationLeft,
    selectOption,
    clearAnswer,
    toggleFlag,
    finishQuiz
  };
};
