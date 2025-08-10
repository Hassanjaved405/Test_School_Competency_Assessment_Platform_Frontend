import React from 'react';
import { Question as QuestionType } from '../types';

interface QuestionProps {
  question: QuestionType;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string;
  onAnswerChange: (answer: 'a' | 'b' | 'c' | 'd') => void;
}

const Question: React.FC<QuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerChange
}) => {
  const options = [
    { key: 'a' as const, text: question.options.a },
    { key: 'b' as const, text: question.options.b },
    { key: 'c' as const, text: question.options.c },
    { key: 'd' as const, text: question.options.d }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-500">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
            {question.competency}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div 
            className="bg-primary-500 h-1 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
          {question.questionText}
        </h3>
      </div>

      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.key}
            className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
              selectedAnswer === option.key
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200'
            }`}
          >
            <input
              type="radio"
              name={`question-${question._id}`}
              value={option.key}
              checked={selectedAnswer === option.key}
              onChange={() => onAnswerChange(option.key)}
              className="mt-0.5 h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium ${
                  selectedAnswer === option.key
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {option.key.toUpperCase()}
                </span>
                <span className="text-gray-900">{option.text}</span>
              </div>
            </div>
          </label>
        ))}
      </div>

      {!selectedAnswer && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Please select an answer to continue.
          </p>
        </div>
      )}
    </div>
  );
};

export default Question;