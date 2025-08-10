import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useGetAssessmentStatusQuery } from '../store/api/assessmentApi';
import { Link } from 'react-router-dom';
import { FiFileText, FiAward, FiTrendingUp, FiClock } from 'react-icons/fi';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: assessmentStatus } = useGetAssessmentStatusQuery();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Welcome back, {user?.firstName}!
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Assessment Status</p>
              <p className="text-2xl font-bold text-gray-900">
                {assessmentStatus?.data?.hasAssessment ? 'In Progress' : 'Not Started'}
              </p>
            </div>
            <FiFileText className="text-primary-600" size={32} />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Level</p>
              <p className="text-2xl font-bold text-gray-900">
                {assessmentStatus?.data?.assessment?.finalLevel || 'N/A'}
              </p>
            </div>
            <FiAward className="text-success-600" size={32} />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                Step {assessmentStatus?.data?.assessment?.currentStep || 0}/3
              </p>
            </div>
            <FiTrendingUp className="text-primary-600" size={32} />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Time Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((assessmentStatus?.data?.assessment?.totalTimeSpent || 0) / 60)} min
              </p>
            </div>
            <FiClock className="text-gray-600" size={32} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/assessment" className="block">
              <button className="w-full btn-primary">
                {assessmentStatus?.data?.hasAssessment ? 'Continue Assessment' : 'Start Assessment'}
              </button>
            </Link>
            <Link to="/certificates" className="block">
              <button className="w-full btn-secondary">
                View Certificates
              </button>
            </Link>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Assessment Guidelines</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Each step contains 44 questions from 2 competency levels</li>
            <li>• You have 1 minute per question (configurable)</li>
            <li>• Score 75% or higher to proceed to the next step</li>
            <li>• Scoring below 25% in Step 1 means no retake allowed</li>
            <li>• Your final level is determined by your performance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;