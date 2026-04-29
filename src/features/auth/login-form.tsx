"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

type LoginState =
  | { status: "idle"; message: "" }
  | { status: "loading"; message: "Memproses login..." }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useState<LoginState>({ status: "idle", message: "" });

  async function handleSubmit(formData: FormData) {
    const username = String(formData.get("username") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!username || !password) {
      setState({ status: "error", message: "Username dan password wajib diisi." });
      return;
    }

    setState({ status: "loading", message: "Memproses login..." });

    await new Promise((resolve) => setTimeout(resolve, 250));

    if (username !== "admin" || password !== "admin") {
      setState({ status: "error", message: "Username atau password tidak cocok." });
      return;
    }

    window.localStorage.setItem(
      "jibas-modern-session",
      JSON.stringify({ username, role: "Admin", loginAt: new Date().toISOString() }),
    );

    setState({
      status: "success",
      message: "Login berhasil sebagai admin. Mengalihkan ke dashboard...",
    });
    router.push("/");
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium text-slate-700">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-cyan-600 focus:ring-3 focus:ring-cyan-100"
          placeholder="admin"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          Password
        </label>
        <div className="flex h-10 overflow-hidden rounded-md border border-slate-300 focus-within:border-cyan-600 focus-within:ring-3 focus-within:ring-cyan-100">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            className="min-w-0 flex-1 px-3 text-sm outline-none"
            placeholder="Password"
          />
          <button
            type="button"
            className="flex w-10 items-center justify-center text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button className="h-10 w-full" disabled={state.status === "loading"}>
        {state.status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogIn className="h-4 w-4" />
        )}
        Masuk
      </Button>

      {state.message ? (
        <div
          className={`rounded-md border px-3 py-2 text-sm ${
            state.status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : state.status === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-slate-200 bg-slate-50 text-slate-600"
          }`}
        >
          {state.message}
        </div>
      ) : null}
    </form>
  );
}
