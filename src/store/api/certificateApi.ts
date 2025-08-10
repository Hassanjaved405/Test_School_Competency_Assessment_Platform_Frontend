import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from './baseApi';
import { Certificate, ApiResponse } from '../../types';

export const certificateApi = createApi({
  reducerPath: 'certificateApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Certificate'],
  endpoints: (builder) => ({
    getMyCertificates: builder.query<ApiResponse<{ certificates: Certificate[] }>, void>({
      query: () => '/certificates/my-certificates',
      providesTags: ['Certificate'],
    }),
    getCertificateById: builder.query<ApiResponse<{ certificate: Certificate }>, string>({
      query: (id) => `/certificates/${id}`,
      providesTags: ['Certificate'],
    }),
    verifyCertificate: builder.mutation<
      ApiResponse<{
        isValid: boolean;
        certificate: {
          certificateNumber: string;
          level: string;
          issuedDate: string;
          validUntil?: string;
          holderName: string;
          holderEmail: string;
        };
      }>,
      { certificateNumber: string; verificationCode: string }
    >({
      query: (data) => ({
        url: '/certificates/verify',
        method: 'POST',
        body: data,
      }),
    }),
    downloadCertificate: builder.query<Blob, string>({
      query: (id) => ({
        url: `/certificates/${id}/download`,
        responseHandler: (response) => response.blob(),
      }),
    }),
    regenerateCertificate: builder.mutation<
      ApiResponse<{ certificate: Certificate }>,
      { assessmentId: string }
    >({
      query: (data) => ({
        url: '/certificates/regenerate',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Certificate'],
    }),
  }),
});

export const {
  useGetMyCertificatesQuery,
  useGetCertificateByIdQuery,
  useVerifyCertificateMutation,
  useLazyDownloadCertificateQuery,
  useRegenerateCertificateMutation,
} = certificateApi;