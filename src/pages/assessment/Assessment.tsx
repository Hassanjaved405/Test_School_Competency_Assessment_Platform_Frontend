import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { 
  useGetAssessmentStatusQuery, 
  useStartAssessmentMutation 
} from '../../store/api/assessmentApi';
import { toast } from 'react-toastify';
import { 
  FiPlay, 
  FiClock, 
  FiFileText, 
  FiAward, 
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';

const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const { 
    data: assessmentStatus, 
    isLoading, 
    refetch 
  } = useGetAssessmentStatusQuery();
  
  const [startAssessment, { isLoading: isStarting }] = useStartAssessmentMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleStartAssessment = async () => {
    try {
      const result = await startAssessment().unwrap();
      if (result.success) {
        toast.success('Assessment started!');
        navigate('/assessment/step/1');
      }
    } catch (error: any) {
      toast.error(error?.data?.error || 'Failed to start assessment');
    }
  };

  const handleContinueAssessment = () => {
    const currentStep = assessmentStatus?.data?.assessment?.currentStep || 1;
    navigate(`/assessment/step/${currentStep}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const hasAssessment = assessmentStatus?.data?.hasAssessment;
  const assessment = assessmentStatus?.data?.assessment;
  const certificate = assessmentStatus?.data?.certificate;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Digital Competency Assessment
        </h1>
        <p className="text-lg text-gray-600">
          Test your digital skills across 22 competencies and earn your certification
        </p>
      </div>

      {/* Assessment Status */}
      {hasAssessment && assessment ? (
        <>
          <div className="card mb-8">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-full ${
                assessment.isCompleted ? (certificate ? 'bg-green-100' : 'bg-red-100') : 'bg-blue-100'
              }`}>
                {assessment.isCompleted ? (
                  certificate ? (
                    <FiCheckCircle className="text-green-600" size={24} />
                  ) : (
                    <FiXCircle className="text-red-600" size={24} />
                  )
                ) : (
                  <FiClock className="text-blue-600" size={24} />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {assessment.isCompleted ? (
                    certificate ? 'Assessment Completed Successfully' : 'Assessment Failed'
                  ) : 'Assessment In Progress'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Current Step</p>
                    <p className="font-semibold">Step {assessment.currentStep}/3</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time Spent</p>
                    <p className="font-semibold">{Math.round(assessment.totalTimeSpent / 60)} minutes</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Final Level</p>
                    <p className={`font-semibold ${assessment.finalLevel ? 'text-green-600' : 'text-gray-500'}`}>
                      {assessment.finalLevel || 'Not determined'}
                    </p>
                  </div>
                </div>
                
                {!assessment.isCompleted ? (
                  <button
                    onClick={handleContinueAssessment}
                    className="btn-primary"
                  >
                    Continue Assessment
                  </button>
                ) : (
                  <div className="flex space-x-4">
                    {/* Only show View Certificate if user actually has a certificate */}
                    {certificate ? (
                      <Link to="/certificates" className="btn-primary">
                        View Certificate
                      </Link>
                    ) : (
                      <div className="text-red-600 font-medium">
                        Assessment Failed - No Certificate Available
                      </div>
                    )}
                    <Link to="/results" className="btn-secondary">
                      View Results
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Show failure explanation if assessment is completed but no certificate */}
          {assessment.isCompleted && !certificate && (
            <div className="card mb-8 border-red-200 bg-red-50">
              <div className="flex items-start space-x-3">
                <FiAlertCircle className="text-red-600 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-red-800 mb-2">Assessment Failed</h3>
                  <p className="text-sm text-red-700 mb-3">
                    You scored below the minimum threshold required for certification. 
                    According to the assessment policy:
                  </p>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Users who score less than 25% in Step 1 cannot earn any certification</li>
                    <li>• No retakes are allowed for failed Step 1 assessments</li>
                    <li>• You can still view your detailed results to understand your performance</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* New Assessment */
        <div className="card mb-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <FiPlay className="text-primary-600" size={32} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Ready to Start Your Assessment?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Test your digital competency across multiple levels and earn your certification. 
              The assessment consists of 3 progressive steps with 44 questions each.
            </p>
            <button
              onClick={handleStartAssessment}
              disabled={isStarting}
              className="btn-primary text-lg px-8 py-3"
            >
              {isStarting ? 'Starting...' : 'Start Assessment'}
            </button>
          </div>
        </div>
      )}

      {/* Assessment Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="flex items-start space-x-3">
            <FiFileText className="text-primary-600 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Assessment Structure</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Step 1: A1 & A2 Levels (44 questions)</li>
                <li>• Step 2: B1 & B2 Levels (44 questions)</li>
                <li>• Step 3: C1 & C2 Levels (44 questions)</li>
                <li>• 1 minute per question</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start space-x-3">
            <FiAward className="text-green-600 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Scoring System</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Score ≥75%: Proceed to next step</li>
                <li>• Score 50-74%: Get current level certificate</li>
                <li>• Score 25-49%: Get lower level certificate</li>
                <li>• Score &lt;25%: Step 1 failure (no retake)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Important Information */}
      <div className="card border-yellow-200 bg-yellow-50">
        <div className="flex items-start space-x-3">
          <FiAlertCircle className="text-yellow-600 mt-1" size={24} />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Important Information</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Make sure you have a stable internet connection</li>
              <li>• The timer will continue even if you refresh the page</li>
              <li>• Your progress is automatically saved</li>
              <li>• If you score less than 25% in Step 1, no retakes are allowed</li>
              <li>• You can navigate between questions within a step</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Show previous results if available */}
      {certificate && (
        <div className="card mt-6 border-green-200 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">
                Congratulations! You've earned {certificate.level} certification
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Certificate #{certificate.certificateNumber}
              </p>
            </div>
            <Link to="/certificates" className="btn-primary">
              View Certificate
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assessment;