"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { toast } from "sonner";
import { Tags } from "../types/dashboard.types";
import { GetTags } from "../services/dashboard.service";

export const useTags = () => {
  return useQuery({
    queryKey: ["tags-final-v1"],
    queryFn: async () => {
      try {
        const res = await GetTags();
        if(!res){
          throw new Error("Get tags failed!")
        }
        return res.data;
      } catch (error: any) {
        toast.error(error.message);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });
};
