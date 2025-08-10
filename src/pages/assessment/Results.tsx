import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useGetAssessmentStatusQuery } from '../../store/api/assessmentApi';
import { 
  FiCheckCircle, 
  FiXCircle, 
  FiAward, 
  FiClock,
  FiHome,
  FiDownload
} from 'react-icons/fi';

const Results: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const { 
    data: assessmentStatus, 
    isLoading 
  } = useGetAssessmentStatusQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const assessment = assessmentStatus?.data?.assessment;
  const certificate = assessmentStatus?.data?.certificate;

  if (!assessment) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiXCircle className="text-gray-400" size={32} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            No Assessment Results
          </h2>
          <p className="text-gray-600 mb-6">
            You haven't completed any assessments yet.
          </p>
          <Link to="/assessment" className="btn-primary">
            Start Assessment
          </Link>
        </div>
      </div>
    );
  }

  const getStepStatus = (step: number) => {
    let stepData: any = null;
    
    switch (step) {
      case 1:
        stepData = assessment.step1;
        break;
      case 2:
        stepData = assessment.step2;
        break;
      case 3:
        stepData = assessment.step3;
        break;
      default:
        return null;
    }
    
    if (!stepData || !stepData.completedAt) return null;
    
    return {
      score: stepData.score || 0,
      totalQuestions: stepData.questions?.length || 44,
      percentage: stepData.percentage || 0,
      level: null, // Individual step levels aren't stored, only final level
      completed: !!stepData.completedAt
    };
  };

  const getOverallPerformance = () => {
    const steps = [assessment.step1, assessment.step2, assessment.step3];
    const completedSteps = steps.filter(step => step && step.completedAt);
    
    if (completedSteps.length === 0) {
      return { label: 'Not Completed', color: 'bg-gray-500' };
    }
    
    const totalScore = completedSteps.reduce((sum: number, step: any) => sum + (step.score || 0), 0);
    const totalQuestions = completedSteps.reduce((sum: number, step: any) => sum + (step.questions?.length || 44), 0);
    const overallPercentage = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;
    
    if (overallPercentage >= 75) return { label: 'Excellent', color: 'bg-green-500' };
    if (overallPercentage >= 50) return { label: 'Good', color: 'bg-blue-500' };
    if (overallPercentage >= 25) return { label: 'Fair', color: 'bg-yellow-500' };
    return { label: 'Needs Improvement', color: 'bg-red-500' };
  };

  const performance = getOverallPerformance();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Assessment Results</h1>
        <p className="text-lg text-gray-600">
          Your complete assessment performance and achievements
        </p>
      </div>

      {/* Overall Summary */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${assessment.isCompleted ? 'bg-green-100' : 'bg-blue-100'}`}>
              {assessment.isCompleted ? (
                <FiCheckCircle className="text-green-600" size={24} />
              ) : (
                <FiClock className="text-blue-600" size={24} />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {assessment.isCompleted ? 'Assessment Completed' : 'Assessment In Progress'}
              </h2>
              <p className="text-gray-600">
                {assessment.isCompleted ? 'All steps completed' : `Currently on Step ${assessment.currentStep}`}
              </p>
            </div>
          </div>
          <div className="text-right">
            {assessment.finalLevel && (
              <div className="flex items-center space-x-2">
                <FiAward className="text-yellow-600" size={20} />
                <span className="text-lg font-semibold text-gray-900">
                  Level {assessment.finalLevel}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">Steps Completed</p>
            <p className="text-2xl font-bold text-gray-900">
              {[assessment.step1, assessment.step2, assessment.step3].filter(step => step && step.completedAt).length}/3
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Time Spent</p>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round((assessment.totalTimeSpent || 0) / 60)}min
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Overall Performance</p>
            <div className="flex items-center justify-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${performance.color}`}></div>
              <p className="font-bold text-gray-900">{performance.label}</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Certificate</p>
            <p className="text-2xl font-bold text-gray-900">
              {certificate ? '✓' : '–'}
            </p>
          </div>
        </div>
      </div>

      {/* Step Results */}
      <div className="space-y-6">
        {[1, 2, 3].map((step) => {
          const stepStatus = getStepStatus(step);
          const isCurrentStep = assessment.currentStep === step;
          const isCompleted = stepStatus?.completed;

          return (
            <div key={step} className={`card ${isCurrentStep && !isCompleted ? 'border-blue-200 bg-blue-50' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    isCompleted ? 'bg-green-100' : 
                    isCurrentStep ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {isCompleted ? (
                      <FiCheckCircle className="text-green-600" size={24} />
                    ) : isCurrentStep ? (
                      <FiClock className="text-blue-600" size={24} />
                    ) : (
                      <FiXCircle className="text-gray-400" size={24} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Step {step}: {step === 1 ? 'A1 & A2' : step === 2 ? 'B1 & B2' : 'C1 & C2'} Levels
                    </h3>
                    <p className="text-sm text-gray-600">
                      {isCompleted ? 'Completed' : isCurrentStep ? 'In Progress' : 'Not Started'}
                    </p>
                  </div>
                </div>

                {stepStatus && (
                  <div className="text-right">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Score</p>
                        <p className="font-semibold">
                          {stepStatus.score}/{stepStatus.totalQuestions}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Percentage</p>
                        <p className={`font-semibold ${
                          stepStatus.percentage >= 75 ? 'text-green-600' :
                          stepStatus.percentage >= 50 ? 'text-blue-600' :
                          stepStatus.percentage >= 25 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {stepStatus.percentage.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Level</p>
                        <p className="font-semibold">
                          {stepStatus.level || '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mt-8">
        {!assessment.isCompleted ? (
          <Link 
            to={`/assessment/step/${assessment.currentStep}`} 
            className="btn-primary"
          >
            Continue Assessment
          </Link>
        ) : (
          <>
            {certificate && (
              <Link to="/certificates" className="btn-primary">
                <FiDownload className="mr-2" />
                View Certificate
              </Link>
            )}
            <Link to="/dashboard" className="btn-secondary">
              <FiHome className="mr-2" />
              Back to Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Results;