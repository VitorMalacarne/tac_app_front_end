"use client";

import { useEffect, useMemo, useState } from "react";
import type { Dispositivo } from "../models/Dispositivo";
import DispositivoForm from "./DispositivoForm";

interface DispositivoListProps {
  token?: any;
}

export default function DispositivoList({ token }: DispositivoListProps) {
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
  const [loading, setLoading] = useState(true);

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Dispositivo | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ATIVO" | "INATIVO">(
    "ALL"
  );

  // fake fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      const fakeData: Dispositivo[] = [
        { id: "D1", serial: "SN-001-ABC", status: "ATIVO", aviarioId: "A1" },
        { id: "D2", serial: "SN-002-XYZ", status: "INATIVO", aviarioId: "A2" },
        { id: "D3", serial: "SN-003-123", status: "ATIVO", aviarioId: "A1" },
      ];
      setDispositivos(fakeData);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return dispositivos.filter((d) => {
      if (statusFilter !== "ALL" && d.status !== statusFilter) return false;
      if (!ql) return true;
      return (
        d.serial.toLowerCase().includes(ql) ||
        d.aviarioId.toLowerCase().includes(ql) ||
        d.id.toLowerCase().includes(ql)
      );
    });
  }, [dispositivos, q, statusFilter]);

  // handlers
  function openCreate() {
    setEditing(null);
    setOpenForm(true);
  }

  function handleEditClick(d: Dispositivo) {
    setEditing(d);
    setOpenForm(true);
  }

  function handleDeleteClick(d: Dispositivo) {
    const ok = confirm(`Excluir dispositivo ${d.serial} (${d.id})?`);
    if (!ok) return;
    setDispositivos((prev) => prev.filter((x) => x.id !== d.id));
    setMessage("Dispositivo excluído.");
    setTimeout(() => setMessage(null), 2500);
  }

  function handleSubmit(payload: {
    serial: string;
    status: string;
    aviarioId: string;
  }) {
    if (editing) {
      setDispositivos((prev) =>
        prev.map((it) => (it.id === editing.id ? { ...it, ...payload } : it))
      );
      setMessage("Dispositivo atualizado.");
    } else {
      const newDevice: Dispositivo = {
        id: `D${Date.now()}`,
        serial: payload.serial,
        status: payload.status,
        aviarioId: payload.aviarioId,
      };
      setDispositivos((prev) => [newDevice, ...prev]);
      setMessage("Dispositivo criado.");
    }
    setOpenForm(false);
    setEditing(null);
    setTimeout(() => setMessage(null), 2500);
  }

  if (loading) {
    return (
      <div className="rounded-lg bg-white shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-gray-200 rounded" />
          <div className="h-8 w-full bg-gray-200 rounded" />
          <div className="h-40 w-full bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow p-6">
      <div className="flex items-center justify-between mb-4 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Dispositivos</h3>
          <p className="text-sm text-gray-500">
            Gerencie dispositivos e associe aos aviários.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {message && (
            <div className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
              {message}
            </div>
          )}
          <button
            onClick={openCreate}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md cursor-pointer"
          >
            + Novo
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex-1">
          <input
            type="search"
            placeholder="Pesquisar por serial, aviário ou id..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border rounded-md px-3 py-2 bg-white cursor-pointer"
          >
            <option value="ALL">Todos</option>
            <option value="ATIVO">Ativos</option>
            <option value="INATIVO">Inativos</option>
          </select>
        </div>
      </div>

      <div className="hidden sm:grid grid-cols-5 gap-4 text-sm text-gray-500 border-b pb-2 mb-2">
        <div>Serial</div>
        <div>Aviário</div>
        <div>Status</div>
        <div>ID</div>
        <div className="text-right">Ações</div>
      </div>

      <ul className="space-y-3">
        {filtered.length === 0 ? (
          <li className="p-6 text-center text-gray-500">
            Nenhum dispositivo encontrado.
          </li>
        ) : (
          filtered.map((d) => (
            <li
              key={d.id}
              className="group border rounded-lg p-4 flex flex-col sm:grid sm:grid-cols-5 sm:items-center gap-3 sm:gap-4"
            >
              <div className="font-medium text-gray-800">{d.serial}</div>
              <div className="text-sm text-gray-600">{d.aviarioId}</div>
              <div>
                <span
                  className={`inline-flex items-center gap-2 px-2 py-1 text-xs font-semibold rounded-full ${
                    d.status === "ATIVO"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      d.status === "ATIVO" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  {d.status}
                </span>
              </div>

              <div className="text-sm text-gray-500 hidden sm:block">
                {d.id}
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => handleEditClick(d)}
                  className="px-2 py-1 text-sm rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 cursor-pointer"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClick(d)}
                  className="px-2 py-1 text-sm rounded-md bg-red-50 hover:bg-red-100 text-red-700 cursor-pointer"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {openForm && (
        <DispositivoForm
          initial={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setOpenForm(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
