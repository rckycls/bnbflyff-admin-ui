import React from "react";
import { useMutation } from "@tanstack/react-query";
import axiosClient from "../../api/axiosClient";
import { useForm } from "react-hook-form";

type CreateAccountForm = {
  account: string;
  password: string;
  cash?: number;
  email?: string;
};

const CreateAccount: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateAccountForm>();

  const mutation = useMutation({
    mutationFn: (data: CreateAccountForm) =>
      axiosClient.post("/auth/accounts/create", data),
    onSuccess: () => {
      alert("Account created successfully!");
      reset();
    },
    onError: (error: any) => {
      alert(
        error?.response?.data?.message || "Failed to create account. Try again."
      );
    },
  });

  const onSubmit = (data: CreateAccountForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-surface text-gray-800 p-6 space-y-8 max-w-xl mx-auto">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-brand">Create New Account</h1>
        <p className="mt-2 text-gray-600">Register a new player account.</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium text-text">Account Name</label>
          <input
            type="text"
            {...register("account", { required: "Account is required" })}
            className="w-full border border-text text-text px-4 py-2 rounded"
          />
          {errors.account && (
            <p className="text-red-500 text-sm mt-1">
              {errors.account.message}
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium text-text">Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="w-full border border-text text-text px-4 py-2 rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium text-text">Cash (Optional)</label>
          <input
            type="number"
            {...register("cash")}
            className="w-full border border-text text-text px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium text-text">Email (Optional)</label>
          <input
            type="email"
            {...register("email")}
            className="w-full border border-text text-text px-4 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-brand text-white py-2 rounded hover:bg-brand-dark transition"
        >
          {mutation.isPending ? "Creating..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default CreateAccount;
