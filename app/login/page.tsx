// "use client";

// import { useState } from "react";
// import { API_SPRING } from "../const";

// export default function LoginPage() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [mensagem, setMensagem] = useState("");

//   const handleLogin = async (e: any) => {
//     e.preventDefault();

//     try {
//       const res = await fetch(`${API_SPRING}/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setMensagem("Erro: " + (data.error || "Falha ao autenticar"));
//         return;
//       }

//       const tokens = data.AuthenticationResult;

//       localStorage.setItem("idToken", tokens.IdToken);
//       localStorage.setItem("accessToken", tokens.AccessToken);
//       localStorage.setItem("refreshToken", tokens.RefreshToken);

//       setMensagem("Login realizado com sucesso!");
//       window.location.href = "/dashboard";
//     } catch (error) {
//       setMensagem("Erro ao conectar com servidor.");
//     }
//   };

//   return (
//     <main className="max-w-md mx-auto p-6">
//       <h1 className="text-xl font-bold mb-4">Login</h1>

//       {mensagem && <p className="mb-4">{mensagem}</p>}

//       <form className="flex flex-col gap-4" onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="E-mail"
//           className="border p-2 rounded"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Senha"
//           className="border p-2 rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button
//           type="submit"
//           className="bg-blue-600 text-white p-2 rounded"
//         >
//           Entrar
//         </button>
//       </form>
//     </main>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_SPRING } from "../const";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(null);

    // validação simples
    if (!username.trim() || !password) {
      setMensagem("Preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_SPRING}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // se seu backend usa cookies HttpOnly, adicione credentials: "include"
        // credentials: "include",
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // tenta mostrar mensagem útil do backend
        const errMsg =
          (data && (data.message || data.error || data.error_description)) ||
          "Falha ao autenticar";
        setMensagem(`Erro: ${errMsg}`);
        setLoading(false);
        setPassword("");
        return;
      }

      // backend devolve tokens (ou pode devolver apenas um jwt custom)
      const tokens = data.AuthenticationResult || data;

      // armazenar tokens (por enquanto localStorage — ver nota de segurança abaixo)
      if (tokens.IdToken) localStorage.setItem("idToken", tokens.IdToken);
      if (tokens.AccessToken)
        localStorage.setItem("accessToken", tokens.AccessToken);
      if (tokens.RefreshToken)
        localStorage.setItem("refreshToken", tokens.RefreshToken);

      setMensagem("Login realizado com sucesso!");
      setPassword("");
      // redireciona para dashboard (use router do Next)
      router.push("/dashboard");
    } catch (error) {
      console.error("login error", error);
      setMensagem("Erro ao conectar com o servidor.");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Login</h1>

      {mensagem && (
        <div className="mb-4 text-sm text-red-600" role="alert">
          {mensagem}
        </div>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleLogin}>
        <label className="flex flex-col">
          <span className="text-sm text-gray-700 mb-1">E-mail</span>
          <input
            type="email"
            placeholder="seu@exemplo.com"
            className="border p-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-gray-700 mb-1">Senha</span>
          <input
            type="password"
            placeholder="Senha"
            className="border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          className={`bg-blue-600 text-white p-2 rounded disabled:opacity-60`}
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
