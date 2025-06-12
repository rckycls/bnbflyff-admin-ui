import { useMutation } from "@tanstack/react-query";
import axiosClient from "../api/axiosClient";

type LoginPayload = {
  account: string;
  password: string;
};

type LoginResponse = {
  token: string;
  user: {
    id: number;
    account: string;
  };
};

export const useLogin = () =>
  useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (payload) =>
      axiosClient.post("/auth/login", payload).then((res) => res.data),
  });
