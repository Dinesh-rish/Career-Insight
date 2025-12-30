import React, { useState } from 'react';
import { Question, QuizAnswer } from '../types';
import Button from './Button';
import { QUESTIONS } from '../constants';

interface QuizProps {
  onComplete: (answers: QuizAnswer[]) => void;
}

const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const totalQuestions = QUESTIONS.length;
  const progress = ((currentQuestionIndex) / totalQuestions) * 100;

  const handleAnswer = (score: number) => {
    const newAnswers = { ...answers, [currentQuestion.id]: score };
    setAnswers(newAnswers);

    if (currentQuestionIndex < totalQuestions - 1) {
      // Small delay for better UX
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 200);
    } else {
      // Finish quiz
      const formattedAnswers: QuizAnswer[] = Object.entries(newAnswers).map(([id, s]) => ({
        questionId: Number(id),
        score: s as number
      }));
      onComplete(formattedAnswers);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 mb-8">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="mb-8">
        <span className="text-sm font-semibold text-blue-600 tracking-wider uppercase">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </span>
        <h3 className="text-2xl font-bold text-slate-900 mt-3 leading-relaxed">
          {currentQuestion.text}
        </h3>
        <p className="text-sm text-slate-400 mt-2 italic">
          Targeting: {currentQuestion.dimension}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {[
          { label: "Strongly Disagree", val: 1 },
          { label: "Disagree", val: 2 },
          { label: "Neutral", val: 3 },
          { label: "Agree", val: 4 },
          { label: "Strongly Agree", val: 5 }
        ].map((option) => (
          <button
            key={option.val}
            onClick={() => handleAnswer(option.val)}
            className="w-full text-left px-6 py-4 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 font-medium transition-all flex justify-between items-center group"
          >
            <span>{option.label}</span>
            <span className="w-6 h-6 rounded-full border-2 border-slate-300 group-hover:border-blue-500 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;