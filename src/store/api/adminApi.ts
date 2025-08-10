import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from './baseApi';
import { User, Assessment, ApiResponse, UserRole } from '../../types';

interface DashboardStats {
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalAssessments: number;
    completedAssessments: number;
    totalCertificates: number;
    totalQuestions: number;
    passRate: string;
  };
  usersByRole: { _id: string; count: number }[];
  certificatesByLevel: { _id: string; count: number }[];
  recentAssessments: any[];
}

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Admin', 'Users'],
  endpoints: (builder) => ({
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
    getUserById: builder.query<
      ApiResponse<{ user: User; assessments: Assessment[]; certificates: any[] }>,
      string
    >({
      query: (id) => `/admin/users/${id}`,
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
    deleteUser: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users', 'Admin'],
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
  useGetDashboardStatsQuery,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserStatusMutation,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useGetAssessmentReportsQuery,
} = adminApi;