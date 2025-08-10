import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from './baseApi';
import { Assessment, Question, Answer, ApiResponse, Certificate } from '../../types';

export const assessmentApi = createApi({
  reducerPath: 'assessmentApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Assessment'],
  endpoints: (builder) => ({
    startAssessment: builder.mutation<ApiResponse<{ assessment: Assessment }>, void>({
      query: () => ({
        url: '/assessment/start',
        method: 'POST',
      }),
      invalidatesTags: ['Assessment'],
    }),
    getAssessmentStatus: builder.query<
      ApiResponse<{ hasAssessment: boolean; assessment?: Assessment; certificate?: Certificate }>,
      void
    >({
      query: () => '/assessment/status',
      providesTags: ['Assessment'],
    }),
    getStepQuestions: builder.query<
      ApiResponse<{ step: number; questions: Question[]; startedAt: string; timePerQuestion: number }>,
      number
    >({
      query: (step) => `/assessment/step/${step}/questions`,
      providesTags: ['Assessment'],
    }),
    submitStepAnswers: builder.mutation<
      ApiResponse<{
        score: number;
        totalQuestions: number;
        percentage: number;
        finalLevel: string | null;
        proceedToNext: boolean;
        isCompleted: boolean;
      }>,
      { step: number; answers: Answer[] }
    >({
      query: ({ step, answers }) => ({
        url: `/assessment/step/${step}/submit`,
        method: 'POST',
        body: { answers },
      }),
      invalidatesTags: ['Assessment'],
    }),
    getAssessmentHistory: builder.query<
      ApiResponse<{ assessments: Assessment[] }>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/assessment/history',
        params: { page, limit },
      }),
      providesTags: ['Assessment'],
    }),
  }),
});

export const {
  useStartAssessmentMutation,
  useGetAssessmentStatusQuery,
  useGetStepQuestionsQuery,
  useSubmitStepAnswersMutation,
  useGetAssessmentHistoryQuery,
} = assessmentApi;