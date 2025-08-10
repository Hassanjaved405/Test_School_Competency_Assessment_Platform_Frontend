import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiFileText, FiAward, FiTrendingUp, FiActivity, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import { useGetAdminStatsQuery } from '../../store/api/adminApi';
import { format } from 'date-fns';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
          {trend !== undefined && (
            <p className={`text-sm mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { data: stats, isLoading, refetch } = useGetAdminStatsQuery();
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    // Fetch recent activity
    if (stats) {
      setRecentActivity(stats.recentActivity || []);
    }
  }, [stats]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const dashboardStats = stats || {
    totalUsers: 0,
    totalAssessments: 0,
    totalCertificates: 0,
    totalQuestions: 0,
    activeUsers: 0,
    passRate: 0,
    averageScore: 0,
    completionRate: 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={dashboardStats.totalUsers}
          icon={<FiUsers className="text-white text-2xl" />}
          color="bg-blue-500"
          trend={12}
        />
        <StatCard
          title="Total Assessments"
          value={dashboardStats.totalAssessments}
          icon={<FiFileText className="text-white text-2xl" />}
          color="bg-green-500"
          trend={8}
        />
        <StatCard
          title="Certificates Issued"
          value={dashboardStats.totalCertificates}
          icon={<FiAward className="text-white text-2xl" />}
          color="bg-purple-500"
          trend={15}
        />
        <StatCard
          title="Total Questions"
          value={dashboardStats.totalQuestions}
          icon={<FiActivity className="text-white text-2xl" />}
          color="bg-orange-500"
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Pass Rate</h3>
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="text-4xl font-bold text-green-600">
                {dashboardStats.passRate || 0}%
              </div>
              <FiCheckCircle className="absolute -top-2 -right-8 text-green-500 text-2xl" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-4 text-center">
            Students passing assessments
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Average Score</h3>
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="text-4xl font-bold text-blue-600">
                {dashboardStats.averageScore || 0}%
              </div>
              <FiTrendingUp className="absolute -top-2 -right-8 text-blue-500 text-2xl" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-4 text-center">
            Overall average assessment score
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Completion Rate</h3>
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="text-4xl font-bold text-purple-600">
                {dashboardStats.completionRate || 0}%
              </div>
              <FiActivity className="absolute -top-2 -right-8 text-purple-500 text-2xl" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-4 text-center">
            Assessments completed vs started
          </p>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/admin/users"
              className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition"
            >
              <div className="flex items-center space-x-3">
                <FiUsers className="text-blue-500" />
                <span>Manage Users</span>
              </div>
              <span className="text-gray-400">→</span>
            </Link>
            <Link
              to="/admin/questions"
              className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition"
            >
              <div className="flex items-center space-x-3">
                <FiFileText className="text-green-500" />
                <span>Manage Questions</span>
              </div>
              <span className="text-gray-400">→</span>
            </Link>
            <Link
              to="/admin/reports"
              className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition"
            >
              <div className="flex items-center space-x-3">
                <FiTrendingUp className="text-purple-500" />
                <span>View Reports</span>
              </div>
              <span className="text-gray-400">→</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                  <div className="mt-1">
                    {activity.type === 'registration' && <FiUsers className="text-blue-500" />}
                    {activity.type === 'assessment' && <FiFileText className="text-green-500" />}
                    {activity.type === 'certificate' && <FiAward className="text-purple-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {activity.timestamp && format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <FiCheckCircle className="text-green-500 text-xl" />
            <div>
              <p className="font-medium">Database</p>
              <p className="text-sm text-gray-600">Connected</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FiCheckCircle className="text-green-500 text-xl" />
            <div>
              <p className="font-medium">API Services</p>
              <p className="text-sm text-gray-600">Operational</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FiClock className="text-yellow-500 text-xl" />
            <div>
              <p className="font-medium">Email Service</p>
              <p className="text-sm text-gray-600">Limited</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;