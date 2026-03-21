import api from "@/api/axios";

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
