import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useAuth } from "../lib/context/AuthContext";

// Form schema from your existing AuthForm
const formSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters" }).max(50),
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }).max(100).optional(),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});

// Type definition for form values
type FormValues = z.infer<typeof formSchema>;
type FormType = "sign-in" | "sign-up";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

export const useAuthForm = (type: FormType) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { dispatch } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      if (type === "sign-up") {
        dispatch({ type: 'SIGNUP_REQUEST' });
        const response = await axios.post(`${SERVER_URL}/api/auth/signup`, values);
        dispatch({ type: 'SIGNUP_SUCCESS', payload: response.data.user });
        return response.data;
      } else {
        dispatch({ type: 'SIGNIN_REQUEST' });
        const response = await axios.post(`${SERVER_URL}/api/auth/signin`, {
          email: values.email,
          password: values.password
        });
        dispatch({ type: 'SIGNIN_SUCCESS', payload: response.data.user });
        return response.data;
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'An error occurred. Please try again.';
      setErrorMessage(errorMsg);
      if (type === "sign-up") {
        dispatch({ type: 'SIGNUP_FAILURE', payload: errorMsg });
      } else {
        dispatch({ type: 'SIGNIN_FAILURE', payload: errorMsg });
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${SERVER_URL}/api/auth/google`;
  };

  const signOut = async () => {
    try {
      await axios.post(`${SERVER_URL}/api/auth/signout`);
      dispatch({ type: 'SIGNOUT' });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    errorMessage,
    handleGoogleAuth,
    signOut
  };
};