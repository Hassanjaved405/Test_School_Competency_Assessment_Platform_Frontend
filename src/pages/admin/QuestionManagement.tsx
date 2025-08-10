import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiFilter, FiUpload, FiDownload, FiBookOpen, FiCheckCircle } from 'react-icons/fi';
import { useGetQuestionsQuery, useCreateQuestionMutation, useUpdateQuestionMutation, useDeleteQuestionMutation } from '../../store/api/questionApi';
import { toast } from 'react-toastify';
import { CompetencyLevel } from '../../types';

interface QuestionData {
  _id: string;
  competency: string;
  difficulty: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  createdAt: string;
}

const competencies = [
  'Computer Basics', 'Internet Basics', 'Email Communication', 'Word Processing',
  'Spreadsheets', 'Presentation Software', 'Database Management', 'Web Browsing',
  'Online Safety', 'Digital Communication', 'Cloud Computing', 'Social Media',
  'Digital Marketing', 'E-commerce', 'Programming Basics', 'Data Analysis',
  'Cybersecurity', 'Digital Ethics', 'Mobile Technology', 'Digital Collaboration',
  'Content Creation', 'Emerging Technologies'
];

const QuestionManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompetency, setFilterCompetency] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form state for new/edit question
  const [formData, setFormData] = useState({
    competency: '',
    difficulty: 'basic',
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  });

  const { data: questionsData, isLoading, refetch } = useGetQuestionsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    competency: filterCompetency !== 'all' ? filterCompetency : undefined,
    difficulty: filterDifficulty !== 'all' ? filterDifficulty : undefined
  });

  const [createQuestion] = useCreateQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();

  // Transform questions to match our local format
  const questions: QuestionData[] = (questionsData?.questions || []).map((q: any) => ({
    _id: q._id,
    competency: q.competency,
    difficulty: q.difficulty || 'basic',
    questionText: q.questionText,
    options: q.options ? [q.options.a, q.options.b, q.options.c, q.options.d] : ['', '', '', ''],
    correctAnswer: ['a', 'b', 'c', 'd'].indexOf(q.correctAnswer) || 0,
    explanation: q.explanation,
    createdAt: q.createdAt
  }));
  const totalPages = Math.ceil((questionsData?.total || 0) / itemsPerPage);

  const handleAddQuestion = () => {
    setFormData({
      competency: competencies[0],
      difficulty: 'basic',
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
    setShowAddModal(true);
  };

  const handleEditQuestion = (question: QuestionData) => {
    setEditingQuestion(question);
    setFormData({
      competency: question.competency,
      difficulty: question.difficulty,
      questionText: question.questionText,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || ''
    });
    setShowEditModal(true);
  };

  const handleSaveQuestion = async () => {
    // Validate form
    if (!formData.questionText || !formData.competency) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.options.some(opt => !opt)) {
      toast.error('Please fill in all options');
      return;
    }

    try {
      // Convert array options to object format for API
      const questionPayload = {
        competency: formData.competency,
        difficulty: formData.difficulty,
        questionText: formData.questionText,
        options: {
          a: formData.options[0],
          b: formData.options[1],
          c: formData.options[2],
          d: formData.options[3]
        },
        correctAnswer: ['a', 'b', 'c', 'd'][formData.correctAnswer],
        explanation: formData.explanation,
        level: CompetencyLevel.A1, // Default level
        timeLimit: 60 // Default time limit
      };

      if (showEditModal && editingQuestion) {
        await updateQuestion({
          id: editingQuestion._id,
          updates: questionPayload
        }).unwrap();
        toast.success('Question updated successfully');
      } else {
        await createQuestion(questionPayload).unwrap();
        toast.success('Question created successfully');
      }
      setShowAddModal(false);
      setShowEditModal(false);
      refetch();
    } catch (error) {
      toast.error('Failed to save question');
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteQuestion(id).unwrap();
        toast.success('Question deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete question');
      }
    }
  };

  const handleImportQuestions = () => {
    // Create file input and trigger click
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.json';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        // Handle file import logic here
        toast.info('Import functionality to be implemented');
      }
    };
    input.click();
  };

  const handleExportQuestions = () => {
    const jsonContent = JSON.stringify(questions, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `questions_${new Date().toISOString().split('T')[0]}.json`;
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
        <h1 className="text-3xl font-bold text-gray-800">Question Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={handleImportQuestions}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition flex items-center space-x-2"
          >
            <FiUpload />
            <span>Import</span>
          </button>
          <button
            onClick={handleExportQuestions}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition flex items-center space-x-2"
          >
            <FiDownload />
            <span>Export</span>
          </button>
          <button
            onClick={handleAddQuestion}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition flex items-center space-x-2"
          >
            <FiPlus />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Questions</p>
              <p className="text-2xl font-bold">{questionsData?.total || 0}</p>
            </div>
            <FiBookOpen className="text-3xl text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Basic</p>
              <p className="text-2xl font-bold">{questionsData?.stats?.basic || 0}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">B</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Intermediate</p>
              <p className="text-2xl font-bold">{questionsData?.stats?.intermediate || 0}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 font-bold">I</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Advanced</p>
              <p className="text-2xl font-bold">{questionsData?.stats?.advanced || 0}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold">A</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={filterCompetency}
            onChange={(e) => setFilterCompetency(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Competencies</option>
            {competencies.map(comp => (
              <option key={comp} value={comp}>{comp}</option>
            ))}
          </select>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Difficulties</option>
            <option value="basic">Basic</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="divide-y divide-gray-200">
          {questions.map((question) => (
            <div key={question._id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full
                      ${question.difficulty === 'basic' ? 'bg-green-100 text-green-800' :
                        question.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}>
                      {question.difficulty}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {question.competency}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {question.questionText}
                  </h3>
                  <div className="space-y-2">
                    {question.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {index === question.correctAnswer ? (
                          <FiCheckCircle className="text-green-500" />
                        ) : (
                          <div className="w-4 h-4 border rounded-full"></div>
                        )}
                        <span className={index === question.correctAnswer ? 'font-medium text-green-700' : 'text-gray-700'}>
                          {option}
                        </span>
                      </div>
                    ))}
                  </div>
                  {question.explanation && (
                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <p className="text-sm text-gray-600">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEditQuestion(question)}
                    className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question._id)}
                    className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, questionsData?.total || 0)} of{' '}
            {questionsData?.total || 0} questions
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {showEditModal ? 'Edit Question' : 'Add New Question'}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Competency
                  </label>
                  <select
                    value={formData.competency}
                    onChange={(e) => setFormData({...formData, competency: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {competencies.map(comp => (
                      <option key={comp} value={comp}>{comp}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="basic">Basic</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Text
                </label>
                <textarea
                  value={formData.questionText}
                  onChange={(e) => setFormData({...formData, questionText: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Options
                </label>
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="radio"
                      checked={formData.correctAnswer === index}
                      onChange={() => setFormData({...formData, correctAnswer: index})}
                      className="cursor-pointer"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...formData.options];
                        newOptions[index] = e.target.value;
                        setFormData({...formData, options: newOptions});
                      }}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Explanation (Optional)
                </label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({...formData, explanation: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuestion}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                {showEditModal ? 'Update' : 'Create'} Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionManagement;