import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">
        Bem-vindo ao Sistema de Gerenciamento de Aviários
      </h1>
      <p className="text-gray-600 mb-6">
        Monitore sensores, dispositivos, lotes e muito mais.
      </p>

      {/* Botão para login */}
      <Link
        href="/login"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Fazer Login
      </Link>
    </div>
  );
}
