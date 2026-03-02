import api from "./api";

export interface User {
  id: number;
  last_name: string;
  first_name: string;
  pseudo: string;
  email: string;
  phone: string;
  birthday: string;
  avatar: string | null;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface CheckPseudoResponse {
  available: boolean;
}

export const registerUser = async (data: FormData): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>("/users", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const checkPseudoAvailability = async (pseudo: string): Promise<CheckPseudoResponse> => {
  const response = await api.get<CheckPseudoResponse>(`/users/check-pseudo/${pseudo}`);
  return response.data;
};
