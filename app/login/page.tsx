import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 rounded shadow-lg bg-white">
        <h1 className="text-xl mb-4">Entrar</h1>
        <button
          onClick={() => signIn("cognito")}
          className="px-4 py-2 rounded bg-blue-600 text-white"
        >
          Entrar com Cognito
        </button>
      </div>
    </div>
  );
}
