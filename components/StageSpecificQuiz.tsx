import React, { useState, useEffect } from 'react';
import { Stage, StageQuestion } from '../types';
import { STAGE_SPECIFIC_QUESTIONS } from '../constants';
import Button from './Button';

interface StageSpecificQuizProps {
  stage: Stage;
  onComplete: (answers: Record<string, string>) => void;
}

const StageSpecificQuiz: React.FC<StageSpecificQuizProps> = ({ stage, onComplete }) => {
  const questions = STAGE_SPECIFIC_QUESTIONS[stage];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  // Scroll to top when question changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentIndex]);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete(answers);
    }
  };

  const currentQuestion = questions[currentIndex];
  const isAnswered = !!answers[currentQuestion.id] && answers[currentQuestion.id].trim().length > 0;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Phase 2: Decision Context</h2>
        <p className="text-slate-500 mt-1">
          Specific questions for {stage} ({currentIndex + 1}/{questions.length})
        </p>
        
        <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white p-1 rounded-xl">
        <div className="mb-6">
            <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-full">
                {currentQuestion.category || "General"}
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-4 leading-relaxed">
                {currentQuestion.text}
            </h3>
        </div>

        <div className="space-y-4">
          {currentQuestion.type === 'choice' && currentQuestion.options && (
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(currentQuestion.id, option)}
                  className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all font-medium ${
                    answers[currentQuestion.id] === option
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-slate-100 hover:border-blue-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'text' && (
            <textarea
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
              placeholder="Type your answer here..."
              className="w-full h-32 p-4 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none font-medium text-slate-700"
              autoFocus
            />
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
          <Button 
            onClick={handleNext} 
            disabled={!isAnswered}
            className="w-full md:w-auto"
          >
            {currentIndex === questions.length - 1 ? "Finish Assessment" : "Next Question"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StageSpecificQuiz;
