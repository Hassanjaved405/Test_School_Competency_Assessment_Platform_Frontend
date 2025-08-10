import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from './baseApi';
import { 
  LoginRequest, 
  RegisterRequest, 
  OTPVerifyRequest, 
  User, 
  ApiResponse 
} from '../../types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<
      ApiResponse<{ user: User; tokens: { accessToken: string; refreshToken: string } }>,
      LoginRequest
    >({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<
      ApiResponse<{ userId: string; email: string }>,
      RegisterRequest
    >({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    verifyOTP: builder.mutation<
      ApiResponse<{ user: User; tokens: { accessToken: string; refreshToken: string } }>,
      OTPVerifyRequest
    >({
      query: (otpData) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: otpData,
      }),
    }),
    resendOTP: builder.mutation<ApiResponse, { email: string }>({
      query: (data) => ({
        url: '/auth/resend-otp',
        method: 'POST',
        body: data,
      }),
    }),
    forgotPassword: builder.mutation<ApiResponse, { email: string }>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<
      ApiResponse,
      { token: string; newPassword: string }
    >({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    getProfile: builder.query<ApiResponse<{ user: User }>, void>({
      query: () => '/auth/profile',
    }),
    updateProfile: builder.mutation<
      ApiResponse<{ user: User }>,
      { firstName?: string; lastName?: string }
    >({
      query: (data) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = authApi;