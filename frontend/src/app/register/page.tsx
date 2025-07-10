"use client";

import apiClient from "@/utils/api-client";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RegisterPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiClient.post("/auth/register", form);
      router.push("/");
    } catch (err) {
      if (err instanceof AxiosError) setError(err.message);
      else setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      {error && (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </div>
      )}

      <h2 className="text-4xl font-bold">Create account</h2>

      <fieldset className="fieldset">
        <legend className="fieldset-legend text-sm">Name</legend>
        <input
          type="text"
          name="name"
          className="input w-full"
          placeholder="John Smith"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend text-sm">Email</legend>
        <input
          type="email"
          name="email"
          className="input w-full"
          placeholder="john@smith.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend text-sm">Password</legend>
        <input
          type="password"
          name="password"
          className="input w-full"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend text-sm">Role</legend>
        <select
          defaultValue="Select role"
          className="select w-full"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option disabled={true}>Select role</option>
          <option value="client">Client</option>
          <option value="developer">Developer</option>
        </select>
      </fieldset>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading && <span className="loading loading-spinner"></span>}
        {!loading && "Sign Up"}
      </button>
    </form>
  );
};

export default RegisterPage;
