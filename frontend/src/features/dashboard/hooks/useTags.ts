"use client";

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { GetTags } from "../services/dashboard.service";

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Get tags failed!";
}

export const useTags = () => {
  return useQuery({
    queryKey: ["tags-final-v1"],
    queryFn: async () => {
      try {
        const res = await GetTags();
        if (!res) {
          throw new Error("Get tags failed!");
        }
        return res.data;
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });
};
