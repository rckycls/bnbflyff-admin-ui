import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, isPending } = useLogin();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      { account, password },
      {
        onSuccess: () => {
          login();
        },
        onError: () => {
          alert("Invalid credentials");
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen bg-surface items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg space-y-6"
      >
        <div className="text-center">
          <h1 className="text-xl font-bold text-brand">FlyFF Admin Panel</h1>
        </div>
        <input
          type="text"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          placeholder="Account"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <button
          type="submit"
          className="w-full bg-secondary hover:opacity-90 text-black font-semibold py-3 rounded-md"
          disabled={isPending}
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
