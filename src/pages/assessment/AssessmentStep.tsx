import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { 
  useGetStepQuestionsQuery, 
  useSubmitStepAnswersMutation 
} from '../../store/api/assessmentApi';
import { 
  setCurrentQuestions, 
  updateAnswer, 
  updateTimeSpent, 
  setTimerRunning 
} from '../../store/slices/assessmentSlice';
import Timer from '../../components/Timer';
import Question from '../../components/Question';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi';

const AssessmentStep: React.FC = () => {
  const { step } = useParams<{ step: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  
  const { currentQuestions, currentAnswers, isTimerRunning } = useSelector(
    (state: RootState) => state.assessment
  );

  const stepNumber = parseInt(step || '1');
  
  const { 
    data: questionsData, 
    isLoading, 
    error 
  } = useGetStepQuestionsQuery(stepNumber);
  
  const [submitAnswers, { isLoading: isSubmitting }] = useSubmitStepAnswersMutation();

  useEffect(() => {
    if (questionsData?.success && questionsData.data) {
      dispatch(setCurrentQuestions(questionsData.data.questions));
      dispatch(setTimerRunning(true));
      setStartTime(Date.now());
    }
  }, [questionsData, dispatch]);

  const currentQuestion = currentQuestions[currentQuestionIndex];
  const currentAnswer = currentAnswers.find(a => a.questionId === currentQuestion?._id)?.answer || '';

  const handleAnswerChange = (answer: 'a' | 'b' | 'c' | 'd') => {
    if (!currentQuestion) return;
    
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    dispatch(updateAnswer({ 
      questionId: currentQuestion._id, 
      answer 
    }));
    
    dispatch(updateTimeSpent({ 
      questionId: currentQuestion._id, 
      timeSpent 
    }));
    
    setStartTime(Date.now());
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setStartTime(Date.now());
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setStartTime(Date.now());
    }
  };

  const handleSubmitStep = async () => {
    try {
      dispatch(setTimerRunning(false));
      
      const finalAnswers = currentAnswers.map(answer => ({
        ...answer,
        timeSpent: answer.timeSpent + Math.floor((Date.now() - startTime) / 1000)
      }));

      const result = await submitAnswers({ 
        step: stepNumber, 
        answers: finalAnswers 
      }).unwrap();

      if (result.success) {
        toast.success(`Step ${stepNumber} completed!`);
        navigate('/assessment/result', { 
          state: { 
            stepResult: result.data,
            step: stepNumber
          } 
        });
      }
    } catch (error: any) {
      toast.error(error?.data?.error || 'Failed to submit assessment');
      dispatch(setTimerRunning(true));
    }
  };

  const handleTimeUp = () => {
    toast.warning('Time is up! Submitting your answers...');
    handleSubmitStep();
  };

  const getAnsweredCount = (): number => {
    return currentAnswers.filter(a => a.answer !== '').length;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <h2 className="text-2xl font-bold">Error Loading Assessment</h2>
            <p className="mt-2">Unable to load questions. Please try again.</p>
          </div>
          <button 
            onClick={() => navigate('/assessment')} 
            className="btn-primary"
          >
            Back to Assessment
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="card">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">No Questions Available</h2>
          <p className="mt-2 text-gray-600">Please contact support.</p>
        </div>
      </div>
    );
  }

  const totalTime = currentQuestions.length * 60; // 1 minute per question

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Assessment Step {stepNumber}
          </h1>
          <div className="text-sm text-gray-600">
            {getAnsweredCount()} of {currentQuestions.length} questions answered
          </div>
        </div>
        
        <Timer 
          totalTime={totalTime}
          onTimeUp={handleTimeUp}
          isRunning={isTimerRunning}
        />
      </div>

      <Question
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={currentQuestions.length}
        selectedAnswer={currentAnswer}
        onAnswerChange={handleAnswerChange}
      />

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiArrowLeft />
            <span>Previous</span>
          </button>

          <div className="flex space-x-4">
            {currentQuestionIndex === currentQuestions.length - 1 ? (
              <button
                onClick={handleSubmitStep}
                disabled={isSubmitting || getAnsweredCount() === 0}
                className="flex items-center space-x-2 btn-primary disabled:opacity-50"
              >
                <FiCheck />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Step'}</span>
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === currentQuestions.length - 1}
                className="flex items-center space-x-2 btn-primary"
              >
                <span>Next</span>
                <FiArrowRight />
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="flex justify-center space-x-1">
            {currentQuestions.map((_, index) => {
              const answered = currentAnswers[index]?.answer !== '';
              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                    index === currentQuestionIndex
                      ? 'bg-primary-500 text-white'
                      : answered
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Click on a number to jump to that question
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssessmentStep;