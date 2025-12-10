"use client";

import { useEffect, useState, useMemo } from "react";
import type { Pessoa } from "../models/Pessoa";

interface PessoaListProps {
  token: any;
}

export default function PessoaList({ token }: PessoaListProps) {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");

  // --- FETCH FALSO ---
  useEffect(() => {
    const timer = setTimeout(() => {
      const fakeData: Pessoa[] = [
        { id: "P1", nome: "João da Silva", email: "joao.silva@example.com" },
        {
          id: "P2",
          nome: "Maria Oliveira",
          email: "maria.oliveira@example.com",
        },
        { id: "P3", nome: "Carlos Mendes", email: "carlos.mendes@example.com" },
      ];

      setPessoas(fakeData);
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  // --- FILTRO ---
  const filtered = useMemo(() => {
    const v = q.trim().toLowerCase();
    if (!v) return pessoas;

    return pessoas.filter((p) =>
      `${p.nome} ${p.email} ${p.id}`.toLowerCase().includes(v)
    );
  }, [pessoas, q]);

  if (loading) {
    return (
      <div className="rounded-lg bg-white shadow p-6 animate-pulse space-y-4">
        <div className="h-6 w-1/3 bg-gray-200 rounded" />
        <div className="h-8 w-full bg-gray-200 rounded" />
        <div className="h-40 w-full bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow p-6">
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-800 mb-1">Pessoas</h3>
      <p className="text-sm text-gray-500 mb-4">Lista somente leitura.</p>

      {/* Busca */}
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Pesquisar por nome, email ou ID..."
        className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-200"
      />

      {/* Cabeçalho da lista */}
      <div className="hidden sm:grid grid-cols-2 gap-4 text-sm text-gray-500 border-b pb-2 mb-2">
        <span>Nome</span>
        <span>Email</span>
      </div>

      {/* Lista */}
      <ul className="space-y-3">
        {filtered.length === 0 ? (
          <li className="text-center text-gray-500 py-4">
            Nenhuma pessoa encontrada.
          </li>
        ) : (
          filtered.map((p) => (
            <li
              key={p.id}
              className="border rounded-lg p-4 bg-white flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4 shadow-sm"
            >
              <span className="font-medium text-gray-800">{p.nome}</span>
              <span className="text-gray-600 text-sm">{p.email}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
