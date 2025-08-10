import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiCheckCircle, 
  FiXCircle, 
  FiAward, 
  FiArrowRight, 
  FiHome,
  FiDownload
} from 'react-icons/fi';

interface StepResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  finalLevel: string | null;
  proceedToNext: boolean;
  isCompleted: boolean;
}

const AssessmentResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const stepResult = location.state?.stepResult as StepResult;
  const step = location.state?.step as number;

  if (!stepResult) {
    navigate('/assessment');
    return null;
  }

  const getResultIcon = () => {
    if (stepResult.percentage < 25) {
      return <FiXCircle className="text-red-600" size={64} />;
    } else if (stepResult.finalLevel) {
      return <FiAward className="text-green-600" size={64} />;
    } else {
      return <FiCheckCircle className="text-blue-600" size={64} />;
    }
  };

  const getResultColor = () => {
    if (stepResult.percentage < 25) return 'text-red-600';
    if (stepResult.percentage >= 75) return 'text-green-600';
    if (stepResult.percentage >= 50) return 'text-blue-600';
    return 'text-yellow-600';
  };

  const getResultMessage = () => {
    if (step === 1 && stepResult.percentage < 25) {
      return {
        title: 'Assessment Failed',
        subtitle: 'Unfortunately, you scored below the minimum threshold.',
        description: 'You cannot retake the assessment. Please consider reviewing the study materials and trying again in the future.'
      };
    }
    
    if (stepResult.proceedToNext) {
      return {
        title: 'Great Job!',
        subtitle: `You scored ${stepResult.percentage.toFixed(1)}% and can proceed to the next step.`,
        description: `You've been awarded the ${stepResult.finalLevel} certification and can continue to Step ${step + 1}.`
      };
    }
    
    if (stepResult.finalLevel) {
      return {
        title: 'Congratulations!',
        subtitle: `You've completed the assessment with ${stepResult.percentage.toFixed(1)}%.`,
        description: `You've earned the ${stepResult.finalLevel} level certification. Well done!`
      };
    }
    
    return {
      title: 'Step Completed',
      subtitle: `You scored ${stepResult.percentage.toFixed(1)}%.`,
      description: 'Your assessment has been completed successfully.'
    };
  };

  const resultMessage = getResultMessage();

  const getScoreBreakdown = () => {
    const ranges = [
      { min: 75, max: 100, label: 'Excellent', color: 'bg-green-500' },
      { min: 50, max: 74, label: 'Good', color: 'bg-blue-500' },
      { min: 25, max: 49, label: 'Fair', color: 'bg-yellow-500' },
      { min: 0, max: 24, label: 'Needs Improvement', color: 'bg-red-500' }
    ];
    
    return ranges.find(range => 
      stepResult.percentage >= range.min && stepResult.percentage <= range.max
    ) || ranges[ranges.length - 1];
  };

  const scoreBreakdown = getScoreBreakdown();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card text-center">
        <div className="mb-6">
          {getResultIcon()}
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {resultMessage.title}
        </h1>
        
        <p className="text-lg text-gray-600 mb-6">
          {resultMessage.subtitle}
        </p>

        {/* Score Display */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {stepResult.score}/{stepResult.totalQuestions}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Percentage</p>
              <p className={`text-2xl font-bold ${getResultColor()}`}>
                {stepResult.percentage.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Performance</p>
              <div className="flex items-center justify-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${scoreBreakdown.color}`}></div>
                <p className="font-bold text-gray-900">{scoreBreakdown.label}</p>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full ${scoreBreakdown.color} transition-all duration-1000`}
                style={{ width: `${stepResult.percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          {resultMessage.description}
        </p>

        {/* Level Achievement */}
        {stepResult.finalLevel && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <FiAward className="text-green-600" size={24} />
              <h3 className="font-semibold text-green-800">
                Level {stepResult.finalLevel} Achieved!
              </h3>
            </div>
            <p className="text-sm text-green-700">
              You've successfully earned the {stepResult.finalLevel} competency level.
            </p>
          </div>
        )}

        {/* Scoring Thresholds Info */}
        <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-800 mb-2">Scoring Information</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• 75-100%: {step < 3 ? 'Proceed to next step' : 'Highest level achieved'}</p>
            <p>• 50-74%: Current level certification</p>
            <p>• 25-49%: Lower level certification</p>
            <p>• 0-24%: {step === 1 ? 'No certification (no retake allowed)' : 'Maintain previous level'}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {stepResult.proceedToNext && step < 3 ? (
            <>
              <Link
                to={`/assessment/step/${step + 1}`}
                className="flex items-center justify-center space-x-2 btn-primary"
              >
                <span>Continue to Step {step + 1}</span>
                <FiArrowRight />
              </Link>
              <Link to="/dashboard" className="btn-secondary">
                <FiHome className="mr-2" />
                Back to Dashboard
              </Link>
            </>
          ) : stepResult.finalLevel ? (
            <>
              <Link to="/certificates" className="btn-primary">
                <FiDownload className="mr-2" />
                View Certificate
              </Link>
              <Link to="/dashboard" className="btn-secondary">
                <FiHome className="mr-2" />
                Back to Dashboard
              </Link>
            </>
          ) : (
            <Link to="/dashboard" className="btn-primary">
              <FiHome className="mr-2" />
              Back to Dashboard
            </Link>
          )}
        </div>

        {/* Additional Information */}
        {step === 1 && stepResult.percentage < 25 && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              <strong>Important:</strong> As per the assessment policy, users who score below 25% 
              in Step 1 are not eligible for retakes. We encourage you to study the materials 
              and improve your digital competency skills.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentResult;