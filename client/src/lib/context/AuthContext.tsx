"use client";

import  { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const SERVER_URL= process.env.NEXT_PUBLIC_SERVER_URL;

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

interface User {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  isVerified: boolean;
}

// Define the actions
type AuthAction =
  | { type: 'SIGNUP_REQUEST' }
  | { type: 'SIGNUP_SUCCESS'; payload: User }
  | { type: 'SIGNUP_FAILURE'; payload: string }
  | { type: 'SIGNIN_REQUEST' }
  | { type: 'SIGNIN_SUCCESS'; payload: User }
  | { type: 'SIGNIN_FAILURE'; payload: string }
  | { type: 'SIGNOUT' }
  | { type: 'VERIFY_OTP_REQUEST' }
  | { type: 'VERIFY_OTP_SUCCESS'; payload: User }
  | { type: 'VERIFY_OTP_FAILURE'; payload: string };

// Define the initial state
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  message: null,
};

// Create the context
const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Create a reducer to handle actions
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SIGNUP_REQUEST':
    case 'SIGNIN_REQUEST':
    case 'VERIFY_OTP_REQUEST':
      return { ...state, loading: true, error: null, message: null };
    case 'SIGNUP_SUCCESS':
    case 'SIGNIN_SUCCESS':
    case 'VERIFY_OTP_SUCCESS':
      return { ...state, user: action.payload, loading: false, error: null, message: 'Operation successful' };
    case 'SIGNUP_FAILURE':
    case 'SIGNIN_FAILURE':
    case 'VERIFY_OTP_FAILURE':
      return { ...state, loading: false, error: action.payload, message: null };
    case 'SIGNOUT':
      return { ...state, user: null, loading: false, error: null, message: 'Signed out successfully' };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Optional: Check for existing user session on initial load
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/api/auth/protected`);
        if (response.data.user) {
          dispatch({ type: 'SIGNIN_SUCCESS', payload: response.data.user });
        }
      } catch (error) {
        console.log('Failed to check user session:', error);
      }
    };

    checkUserSession();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);