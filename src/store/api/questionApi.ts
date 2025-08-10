import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from './baseApi';
import { Question, ApiResponse, CompetencyLevel, QuestionDifficulty } from '../../types';

interface QuestionStats {
  totalQuestions: number;
  activeQuestions: number;
  totalCompetencies: number;
  levelStats: any[];
  competencies: string[];
}

export const questionApi = createApi({
  reducerPath: 'questionApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Question'],
  endpoints: (builder) => ({
    // New simplified endpoint for QuestionManagement
    getQuestions: builder.query<
      { questions: Question[]; total: number; stats?: any },
      {
        page?: number;
        limit?: number;
        search?: string;
        competency?: string;
        difficulty?: string;
      }
    >({
      query: (params) => ({
        url: '/questions',
        params,
      }),
      providesTags: ['Question'],
    }),
    
    // Original endpoint
    getAllQuestions: builder.query<
      ApiResponse<{ questions: Question[] }>,
      {
        page?: number;
        limit?: number;
        competency?: string;
        level?: CompetencyLevel;
        difficulty?: QuestionDifficulty;
        isActive?: boolean;
      }
    >({
      query: (params) => ({
        url: '/questions',
        params,
      }),
      providesTags: ['Question'],
    }),
    getQuestionById: builder.query<ApiResponse<{ question: Question }>, string>({
      query: (id) => `/questions/${id}`,
      providesTags: ['Question'],
    }),
    getQuestionStats: builder.query<ApiResponse<QuestionStats>, void>({
      query: () => '/questions/stats',
      providesTags: ['Question'],
    }),
    createQuestion: builder.mutation<ApiResponse<{ question: Question }>, Partial<Question>>({
      query: (question) => ({
        url: '/questions',
        method: 'POST',
        body: question,
      }),
      invalidatesTags: ['Question'],
    }),
    updateQuestion: builder.mutation<
      ApiResponse<{ question: Question }>,
      { id: string; updates?: Partial<Question>; question?: Partial<Question> }
    >({
      query: ({ id, updates, question }) => ({
        url: `/questions/${id}`,
        method: 'PUT',
        body: updates || question,
      }),
      invalidatesTags: ['Question'],
    }),
    deleteQuestion: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/questions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Question'],
    }),
    bulkCreateQuestions: builder.mutation<
      ApiResponse<{ count: number; questions: Question[] }>,
      { questions: Partial<Question>[] }
    >({
      query: (data) => ({
        url: '/questions/bulk',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Question'],
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useGetAllQuestionsQuery,
  useGetQuestionByIdQuery,
  useGetQuestionStatsQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useBulkCreateQuestionsMutation,
} = questionApi;