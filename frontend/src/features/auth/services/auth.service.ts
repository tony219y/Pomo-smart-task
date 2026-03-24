import api from "@/api/axios";

const baseApiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const registerUser = async (data: {
  email: string;
  username: string;
  password: string;
}) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const getGoogleLoginUrl = () => {
  if (!baseApiUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not set");
  }

  return `${baseApiUrl}/auth/google`;
};

export const refreshToken = async () => {
  const response = await api.post("/auth/refresh");
  return response.data;
};

export const logOut = async () => {
  return await api.post("/auth/logout");
};
export const GetProfile = async () => {
  return await api.get("/users/me");
};
