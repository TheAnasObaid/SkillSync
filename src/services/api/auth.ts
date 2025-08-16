"use client";

import apiClient from "@/lib/apiClient";
import {
  ForgotPasswordFormData,
  LoginFormData,
  RegisterFormData,
  ResetPasswordFormData,
} from "@/lib/validationSchemas";
import { IUser } from "@/types";

interface LoginResponse {
  user: IUser;
  token: string;
}

export const registerUser = async (
  formData: RegisterFormData
): Promise<{ message: string }> => {
  const { data } = await apiClient.post("/auth/register", formData);
  return data;
};

export const loginUser = async (
  formData: LoginFormData
): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", formData);
  return data;
};

export const logoutUser = async (): Promise<{ message: string }> => {
  const { data } = await apiClient.post("/auth/logout");
  return data;
};

export const forgotPassword = async (
  formData: ForgotPasswordFormData
): Promise<{ message: string }> => {
  const { data } = await apiClient.post("/auth/forgot-password", formData);
  return data;
};

export const resetPassword = async ({
  token,
  formData,
}: {
  token: string;
  formData: ResetPasswordFormData;
}): Promise<LoginResponse> => {
  const { data } = await apiClient.patch<LoginResponse>(
    `/auth/reset-password/${token}`,
    formData
  );
  return data;
};

export const resendVerificationEmail = async (
  email: string
): Promise<{ message: string }> => {
  const { data } = await apiClient.post("/auth/resend-verification", { email });
  return data;
};
