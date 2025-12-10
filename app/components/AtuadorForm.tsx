"use client";

import { useEffect, useState } from "react";
import type { Atuador } from "../models/Atuador";

interface AtuadorFormProps {
  initial?: Atuador | null;
  onSubmit: (payload: any) => void;
  onCancel?: () => void;
}

export default function AtuadorForm({
  initial = null,
  onSubmit,
  onCancel,
}: AtuadorFormProps) {
  const [tipo, setTipo] = useState(initial?.tipo ?? "");
  const [status, setStatus] = useState(initial?.status ?? "DESLIGADO");
  const [dispositivoId, setDispositivoId] = useState(
    initial?.dispositivoId ?? ""
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTipo(initial?.tipo ?? "");
    setStatus(initial?.status ?? "DESLIGADO");
    setDispositivoId(initial?.dispositivoId ?? "");
    setError(null);
  }, [initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!tipo.trim() || !dispositivoId.trim()) {
      setError("Tipo e Dispositivo são obrigatórios.");
      return;
    }

    onSubmit({
      tipo: tipo.trim(),
      status: status.trim(),
      dispositivoId: dispositivoId.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
        onClick={() => onCancel && onCancel()}
      />

      {/* Modal */}
      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fadeIn z-10"
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          {initial ? "Editar Atuador" : "Criar Atuador"}
        </h3>

        {error && (
          <p className="text-sm text-red-600 mb-3 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <label className="block mb-4">
          <span className="text-sm text-gray-700">Tipo</span>
          <input
            className="mt-1 w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none transition"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            placeholder="Ex.: Ventilador"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm text-gray-700">Status</span>
          <select
            className="mt-1 w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none transition cursor-pointer"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="LIGADO">LIGADO</option>
            <option value="DESLIGADO">DESLIGADO</option>
          </select>
        </label>

        <label className="block mb-6">
          <span className="text-sm text-gray-700">ID do Dispositivo</span>
          <input
            className="mt-1 w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none transition"
            value={dispositivoId}
            onChange={(e) => setDispositivoId(e.target.value)}
            placeholder="Ex.: D1"
          />
        </label>

        <div className="flex justify-end gap-3">
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
