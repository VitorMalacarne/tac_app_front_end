"use client";

import { useEffect, useState } from "react";
import type { Dispositivo } from "../models/Dispositivo";

interface DispositivoFormProps {
  initial?: Dispositivo | null;
  onSubmit: (payload: {
    serial: string;
    status: string;
    aviarioId: string;
  }) => void;
  onCancel?: () => void;
}

export default function DispositivoForm({
  initial = null,
  onSubmit,
  onCancel,
}: DispositivoFormProps) {
  const [serial, setSerial] = useState(initial?.serial ?? "");
  const [status, setStatus] = useState(initial?.status ?? "ATIVO");
  const [aviarioId, setAviarioId] = useState(initial?.aviarioId ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSerial(initial?.serial ?? "");
    setStatus(initial?.status ?? "ATIVO");
    setAviarioId(initial?.aviarioId ?? "");
    setError(null);
  }, [initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!serial.trim() || !aviarioId.trim()) {
      setError("Serial e Aviário são obrigatórios.");
      return;
    }
    onSubmit({
      serial: serial.trim(),
      status: status.trim(),
      aviarioId: aviarioId.trim(),
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
        className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10"
      >
        <h3 className="text-xl font-semibold mb-3 text-gray-800">
          {initial ? "Editar Dispositivo" : "Criar Dispositivo"}
        </h3>

        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <label className="block mb-3">
          <span className="text-sm text-gray-700">Serial</span>
          <input
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            placeholder="Ex.: SN-001-ABC"
            className="mt-1 w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-300 outline-none"
          />
        </label>

        <label className="block mb-3">
          <span className="text-sm text-gray-700">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-300 outline-none cursor-pointer"
          >
            <option value="ATIVO">ATIVO</option>
            <option value="INATIVO">INATIVO</option>
          </select>
        </label>

        <label className="block mb-6">
          <span className="text-sm text-gray-700">ID do Aviário</span>
          <input
            value={aviarioId}
            onChange={(e) => setAviarioId(e.target.value)}
            placeholder="Ex.: A1"
            className="mt-1 w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-300 outline-none"
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
