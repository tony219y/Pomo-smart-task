"use client";

import { AxiosError } from "axios";

type ErrorWithMessage = {
  message?: string;
  error?: string;
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
};

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
) {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      fallback
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const apiError = error as ErrorWithMessage;

    return (
      apiError.response?.data?.message ??
      apiError.response?.data?.error ??
      apiError.message ??
      apiError.error ??
      fallback
    );
  }

  return fallback;
}
