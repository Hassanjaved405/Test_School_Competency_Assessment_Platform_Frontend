import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useVerifyOTPMutation, useResendOTPMutation } from '../../store/api/authApi';
import { setCredentials } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';
import { FiLock } from 'react-icons/fi';

interface OTPFormData {
  otp: string;
}

const VerifyOTP: React.FC = () => {
  const [countdown, setCountdown] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const email = location.state?.email || '';
  
  const [verifyOTP, { isLoading }] = useVerifyOTPMutation();
  const [resendOTP, { isLoading: isResending }] = useResendOTPMutation();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<OTPFormData>();

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onSubmit = async (data: OTPFormData) => {
    try {
      const response = await verifyOTP({ email, otp: data.otp }).unwrap();
      if (response.success && response.data) {
        dispatch(setCredentials({
          user: response.data.user,
          accessToken: response.data.tokens.accessToken,
          refreshToken: response.data.tokens.refreshToken
        }));
        toast.success('Email verified successfully!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error?.data?.error || 'Invalid OTP');
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOTP({ email }).unwrap();
      toast.success('OTP sent successfully!');
      setCountdown(60);
    } catch (error: any) {
      toast.error(error?.data?.error || 'Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <FiLock className="text-primary-600" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Verify Your Email</h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent a 6-digit OTP to
            </p>
            <p className="font-medium text-primary-600">{email}</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                {...register('otp', {
                  required: 'OTP is required',
                  minLength: { value: 6, message: 'OTP must be 6 digits' },
                  maxLength: { value: 6, message: 'OTP must be 6 digits' },
                  pattern: { value: /^[0-9]+$/, message: 'OTP must contain only numbers' }
                })}
                type="text"
                maxLength={6}
                className="mt-1 input-field text-center text-2xl font-semibold tracking-widest"
                placeholder="000000"
              />
              {errors.otp && (
                <p className="mt-1 text-sm text-danger-600">{errors.otp.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-lg font-medium"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the OTP?{' '}
                {countdown > 0 ? (
                  <span className="text-gray-500">
                    Resend in {countdown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isResending}
                    className="font-medium text-primary-600 hover:text-primary-700"
                  >
                    {isResending ? 'Sending...' : 'Resend OTP'}
                  </button>
                )}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;