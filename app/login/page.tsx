"use client";

import { useState } from "react";
import { API_SPRING } from "../const";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_SPRING}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensagem("Erro: " + (data.error || "Falha ao autenticar"));
        return;
      }

      const tokens = data.AuthenticationResult;

      localStorage.setItem("idToken", tokens.IdToken);
      localStorage.setItem("accessToken", tokens.AccessToken);
      localStorage.setItem("refreshToken", tokens.RefreshToken);

      setMensagem("Login realizado com sucesso!");
      window.location.href = "/dashboard"; 
    } catch (error) {
      setMensagem("Erro ao conectar com servidor.");
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Login</h1>

      {mensagem && <p className="mb-4">{mensagem}</p>}

      <form className="flex flex-col gap-4" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-mail"
          className="border p-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}