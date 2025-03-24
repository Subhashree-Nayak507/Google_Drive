"use client";

import axios from 'axios';
import { useAuth } from '../context/AuthContext'; 

const SERVER_URL= process.env.NEXT_PUBLIC_SERVER_URL;
// Define interfaces for request data
interface SignupData {
  fullName: string;
  email: string;
  username: string;
  password: string;
}

interface SigninData {
  email: string;
  password: string;
}

interface VerifyOtpData {
  email: string;
  otp: string;
}

// Custom hook that provides auth-related API functions
export const useAuthService = () => {
  const { dispatch } = useAuth();

  // Signup function
  const signup = async (userData: SignupData) => {
    dispatch({ type: 'SIGNUP_REQUEST' });
    try {
      const response = await axios.post(`${SERVER_URL}/api/auth/signup`, userData);
      dispatch({ type: 'SIGNUP_SUCCESS', payload: response.data.user });
      return response.data.user;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Signup failed';
      dispatch({ type: 'SIGNUP_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Signin function
  const signin = async (credentials: SigninData) => {
    dispatch({ type: 'SIGNIN_REQUEST' });
    try {
      const response = await axios.post(`${SERVER_URL}/api/auth/signin`, credentials);
      dispatch({ type: 'SIGNIN_SUCCESS', payload: response.data.user });
      return response.data.user;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Signin failed';
      dispatch({ type: 'SIGNIN_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Verify OTP function
  const verifyOtp = async (verifyData: VerifyOtpData) => {
    dispatch({ type: 'VERIFY_OTP_REQUEST' });
    try {
      const response = await axios.post(`${SERVER_URL}/api/auth/protected`, verifyData);
      dispatch({ type: 'VERIFY_OTP_SUCCESS', payload: response.data.user });
      return response.data.user;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'OTP verification failed';
      dispatch({ type: 'VERIFY_OTP_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Signout function
  const signout = async () => {
    try {
      await axios.post(`${SERVER_URL}/api/auth/protected`);
      dispatch({ type: 'SIGNOUT' });
    } catch (error) {
      console.error('Signout failed:', error);
      dispatch({ type: 'SIGNOUT' });
    }
  };

  return {
    signup,
    signin,
    verifyOtp,
    signout
  };
};