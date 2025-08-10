import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from './baseApi';
import { User, Assessment, ApiResponse, UserRole } from '../../types';

interface DashboardStats {
  totalUsers: number;
  totalAssessments: number;
  totalCertificates: number;
  totalQuestions: number;
  activeUsers: number;
  passRate: number;
  averageScore: number;
  completionRate: number;
  recentActivity: any[];
}

interface ReportsData {
  statistics: {
    totalAssessments: number;
    averageScore: number;
    passRate: number;
    activeUsers: number;
    newUsers: number;
    passedCount: number;
    assessmentGrowth: number;
    scoreChange: number;
  };
  assessmentTrend: {
    labels: string[];
    data: number[];
  };
  competencyPerformance: {
    labels: string[];
    scores: number[];
  };
  difficultyDistribution: {
    basic: number;
    intermediate: number;
    advanced: number;
  };
  passFailRatio: {
    passed: number;
    failed: number;
  };
  topPerformers: Array<{
    name: string;
    averageScore: number;
    assessments: number;
  }>;
  comparison: any;
}

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Admin', 'Users', 'Reports'],
  endpoints: (builder) => ({
    // Dashboard
    getAdminStats: builder.query<DashboardStats, void>({
      query: () => '/admin/dashboard',
      providesTags: ['Admin'],
    }),
    
    // Users Management
    getUsers: builder.query<
      { users: User[]; total: number },
      { page?: number; limit?: number; role?: string; search?: string }
    >({
      query: (params) => ({
        url: '/admin/users',
        params,
      }),
      providesTags: ['Users'],
    }),
    
    getUserById: builder.query<
      { user: User; assessments: Assessment[]; certificates: any[] },
      string
    >({
      query: (id) => `/admin/users/${id}`,
      providesTags: ['Users'],
    }),
    
    updateUser: builder.mutation<
      { user: User },
      { id: string; updates: Partial<User> }
    >({
      query: ({ id, updates }) => ({
        url: `/admin/users/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['Users'],
    }),
    
    deleteUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users', 'Admin'],
    }),
    
    // Reports
    getReports: builder.query<
      ReportsData,
      { dateRange?: string; competency?: string }
    >({
      query: (params) => ({
        url: '/admin/reports',
        params,
      }),
      providesTags: ['Reports'],
    }),
    
    // Legacy endpoints for compatibility
    getDashboardStats: builder.query<ApiResponse<DashboardStats>, void>({
      query: () => '/admin/dashboard',
      providesTags: ['Admin'],
    }),
    
    getAllUsers: builder.query<
      ApiResponse<{ users: User[] }>,
      { page?: number; limit?: number; role?: string; search?: string; isActive?: boolean }
    >({
      query: (params) => ({
        url: '/admin/users',
        params,
      }),
      providesTags: ['Users'],
    }),
    
    updateUserStatus: builder.mutation<
      ApiResponse<{ user: User }>,
      { id: string; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/admin/users/${id}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: ['Users'],
    }),
    
    updateUserRole: builder.mutation<
      ApiResponse<{ user: User }>,
      { id: string; role: UserRole }
    >({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['Users'],
    }),
    
    getAssessmentReports: builder.query<
      ApiResponse<{ assessments: Assessment[] }>,
      {
        page?: number;
        limit?: number;
        userId?: string;
        isCompleted?: boolean;
        level?: string;
        dateFrom?: string;
        dateTo?: string;
      }
    >({
      query: (params) => ({
        url: '/admin/reports/assessments',
        params,
      }),
      providesTags: ['Admin'],
    }),
  }),
});

export const {
  // New endpoints
  useGetAdminStatsQuery,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetReportsQuery,
  // Legacy endpoints
  useGetDashboardStatsQuery,
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
  useUpdateUserRoleMutation,
  useGetAssessmentReportsQuery,
} = adminApi;