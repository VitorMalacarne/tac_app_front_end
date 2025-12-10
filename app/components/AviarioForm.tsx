"use client";

import { useEffect, useState } from "react";
import type { Aviario } from "../models/Aviario";

interface AviarioFormProps {
  initial?: Aviario | null;
  onSubmit: (payload: any) => void;
  onCancel?: () => void;
}

export default function AviarioForm({
  initial = null,
  onSubmit,
  onCancel,
}: AviarioFormProps) {
  const [nome, setNome] = useState(initial?.nome ?? "");
  const [capacidade, setCapacidade] = useState<string>(
    initial ? String(initial.capacidadeMaxima) : ""
  );
  const [localizacao, setLocalizacao] = useState(initial?.localizacao ?? "");
  const [ativo, setAtivo] = useState<number>(
    initial ? (initial.ativo ? 1 : 0) : 1
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNome(initial?.nome ?? "");
    setCapacidade(initial ? String(initial.capacidadeMaxima) : "");
    setLocalizacao(initial?.localizacao ?? "");
    setAtivo(initial ? (initial.ativo ? 1 : 0) : 1);
    setError(null);
  }, [initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // validações básicas
    if (!nome.trim()) {
      setError("Nome é obrigatório.");
      return;
    }
    const capNum = Number(capacidade);
    if (!capacidade || Number.isNaN(capNum) || capNum <= 0) {
      setError("Capacidade deve ser um número positivo.");
      return;
    }
    if (!localizacao.trim()) {
      setError("Localização é obrigatória.");
      return;
    }

    onSubmit({
      nome: nome.trim(),
      capacidadeMaxima: capNum,
      localizacao: localizacao.trim(),
      ativo: ativo === 1 ? 1 : 0,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
        onClick={() => onCancel && onCancel()}
      />

      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 z-10"
      >
        <h3 className="text-xl font-semibold mb-3 text-gray-800">
          {initial ? "Editar Aviário" : "Criar Aviário"}
        </h3>

        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          <label className="block">
            <span className="text-sm text-gray-700">Nome</span>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Aviário Central"
              className="mt-1 w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-gray-700">Capacidade máxima</span>
              <input
                value={capacidade}
                onChange={(e) => setCapacidade(e.target.value)}
                placeholder="Ex.: 5000"
                inputMode="numeric"
                className="mt-1 w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-300 outline-none"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">Ativo</span>
              <select
                value={String(ativo)}
                onChange={(e) => setAtivo(Number(e.target.value))}
                className="mt-1 w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-300 outline-none cursor-pointer"
              >
                <option value="1">Sim</option>
                <option value="0">Não</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-sm text-gray-700">Localização</span>
            <input
              value={localizacao}
              onChange={(e) => setLocalizacao(e.target.value)}
              placeholder="Ex.: Setor Norte"
              className="mt-1 w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            type="button"
            onClick={() => onCancel && onCancel()}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
