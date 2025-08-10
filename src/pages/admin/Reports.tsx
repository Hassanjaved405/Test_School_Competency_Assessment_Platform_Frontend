import React, { useState, useEffect } from 'react';
import { FiDownload, FiCalendar, FiUsers, FiTrendingUp, FiAward, FiBarChart2, FiPieChart, FiFilter } from 'react-icons/fi';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { useGetReportsQuery } from '../../store/api/adminApi';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('last30days');
  const [selectedCompetency, setSelectedCompetency] = useState('all');
  const [reportType, setReportType] = useState('overview');
  
  const { data: reportsData, isLoading, refetch } = useGetReportsQuery({
    dateRange,
    competency: selectedCompetency !== 'all' ? selectedCompetency : undefined
  });

  const competencies = [
    'Computer Basics', 'Internet Basics', 'Email Communication', 'Word Processing',
    'Spreadsheets', 'Presentation Software', 'Database Management', 'Web Browsing',
    'Online Safety', 'Digital Communication', 'Cloud Computing', 'Social Media',
    'Digital Marketing', 'E-commerce', 'Programming Basics', 'Data Analysis',
    'Cybersecurity', 'Digital Ethics', 'Mobile Technology', 'Digital Collaboration',
    'Content Creation', 'Emerging Technologies'
  ];

  // Chart configurations
  const assessmentTrendData = {
    labels: reportsData?.assessmentTrend?.labels || [],
    datasets: [
      {
        label: 'Assessments Taken',
        data: reportsData?.assessmentTrend?.data || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4
      }
    ]
  };

  const competencyPerformanceData = {
    labels: reportsData?.competencyPerformance?.labels || [],
    datasets: [
      {
        label: 'Average Score (%)',
        data: reportsData?.competencyPerformance?.scores || [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const difficultyDistributionData = {
    labels: ['Basic', 'Intermediate', 'Advanced'],
    datasets: [
      {
        data: [
          reportsData?.difficultyDistribution?.basic || 0,
          reportsData?.difficultyDistribution?.intermediate || 0,
          reportsData?.difficultyDistribution?.advanced || 0
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderWidth: 1
      }
    ]
  };

  const passFailData = {
    labels: ['Passed', 'Failed'],
    datasets: [
      {
        data: [
          reportsData?.passFailRatio?.passed || 0,
          reportsData?.passFailRatio?.failed || 0
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderWidth: 1
      }
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  const exportReport = () => {
    const reportContent = {
      generatedAt: new Date().toISOString(),
      dateRange,
      statistics: reportsData?.statistics,
      assessmentTrend: reportsData?.assessmentTrend,
      competencyPerformance: reportsData?.competencyPerformance,
      topPerformers: reportsData?.topPerformers
    };

    const blob = new Blob([JSON.stringify(reportContent, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
        <button
          onClick={exportReport}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition flex items-center space-x-2"
        >
          <FiDownload />
          <span>Export Report</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <FiCalendar className="text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last3months">Last 3 Months</option>
              <option value="last6months">Last 6 Months</option>
              <option value="lastyear">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <FiFilter className="text-gray-400" />
            <select
              value={selectedCompetency}
              onChange={(e) => setSelectedCompetency(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Competencies</option>
              {competencies.map(comp => (
                <option key={comp} value={comp}>{comp}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="overview">Overview</option>
              <option value="performance">Performance</option>
              <option value="engagement">Engagement</option>
              <option value="competency">Competency Analysis</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Assessments</p>
              <p className="text-2xl font-bold">{reportsData?.statistics?.totalAssessments || 0}</p>
              <p className="text-sm text-green-600 mt-1">
                +{reportsData?.statistics?.assessmentGrowth || 0}% this period
              </p>
            </div>
            <FiBarChart2 className="text-3xl text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Average Score</p>
              <p className="text-2xl font-bold">{reportsData?.statistics?.averageScore || 0}%</p>
              <p className="text-sm text-blue-600 mt-1">
                {reportsData?.statistics?.scoreChange > 0 ? '+' : ''}{reportsData?.statistics?.scoreChange || 0}% change
              </p>
            </div>
            <FiTrendingUp className="text-3xl text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pass Rate</p>
              <p className="text-2xl font-bold">{reportsData?.statistics?.passRate || 0}%</p>
              <p className="text-sm text-purple-600 mt-1">
                {reportsData?.statistics?.passedCount || 0} passed
              </p>
            </div>
            <FiAward className="text-3xl text-purple-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Users</p>
              <p className="text-2xl font-bold">{reportsData?.statistics?.activeUsers || 0}</p>
              <p className="text-sm text-orange-600 mt-1">
                {reportsData?.statistics?.newUsers || 0} new
              </p>
            </div>
            <FiUsers className="text-3xl text-orange-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assessment Trend */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Assessment Trend</h3>
          <Line data={assessmentTrendData} options={chartOptions} />
        </div>

        {/* Pass/Fail Ratio */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Pass/Fail Distribution</h3>
          <Doughnut data={passFailData} />
        </div>

        {/* Competency Performance */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-full">
          <h3 className="text-lg font-semibold mb-4">Competency Performance</h3>
          <Bar data={competencyPerformanceData} options={barChartOptions} />
        </div>

        {/* Difficulty Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Assessment Difficulty Distribution</h3>
          <Pie data={difficultyDistributionData} />
        </div>

        {/* Top Performers */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
          <div className="space-y-3">
            {reportsData?.topPerformers?.length > 0 ? (
              reportsData.topPerformers.map((performer: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold
                      ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-500'}`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{performer.name}</p>
                      <p className="text-sm text-gray-600">{performer.assessments} assessments</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{performer.averageScore}%</p>
                    <p className="text-sm text-gray-600">Avg Score</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Statistics Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Detailed Statistics</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Previous Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Total Users
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {reportsData?.comparison?.current?.users || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {reportsData?.comparison?.previous?.users || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`font-medium ${reportsData?.comparison?.userChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {reportsData?.comparison?.userChange > 0 ? '+' : ''}{reportsData?.comparison?.userChange || 0}%
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Assessments Completed
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {reportsData?.comparison?.current?.assessments || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {reportsData?.comparison?.previous?.assessments || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`font-medium ${reportsData?.comparison?.assessmentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {reportsData?.comparison?.assessmentChange > 0 ? '+' : ''}{reportsData?.comparison?.assessmentChange || 0}%
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Certificates Issued
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {reportsData?.comparison?.current?.certificates || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {reportsData?.comparison?.previous?.certificates || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`font-medium ${reportsData?.comparison?.certificateChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {reportsData?.comparison?.certificateChange > 0 ? '+' : ''}{reportsData?.comparison?.certificateChange || 0}%
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Average Completion Time
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {reportsData?.comparison?.current?.avgCompletionTime || 0} min
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {reportsData?.comparison?.previous?.avgCompletionTime || 0} min
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`font-medium ${reportsData?.comparison?.timeChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {reportsData?.comparison?.timeChange > 0 ? '+' : ''}{reportsData?.comparison?.timeChange || 0}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;