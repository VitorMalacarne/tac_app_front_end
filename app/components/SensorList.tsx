"use client";

import { useEffect, useMemo, useState } from "react";
import type { Sensor } from "../models/Sensor";
import SensorForm from "./SensorForm";

interface SensorListProps {
  token?: any;
}

export default function SensorList({ token }: SensorListProps) {
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Sensor | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ATIVO" | "INATIVO">(
    "ALL"
  );

  // ===== fake fetch =====
  useEffect(() => {
    const timer = setTimeout(() => {
      const fakeData: Sensor[] = [
        { id: "S1", tipo: "Temperatura", status: "ATIVO", dispositivoId: "D1" },
        { id: "S2", tipo: "Umidade", status: "ATIVO", dispositivoId: "D3" },
        { id: "S3", tipo: "Amônia", status: "INATIVO", dispositivoId: "D2" },
        { id: "S4", tipo: "CO2", status: "ATIVO", dispositivoId: "D4" },
        {
          id: "S5",
          tipo: "Luminosidade",
          status: "ATIVO",
          dispositivoId: "D5",
        },
      ];
      setSensores(fakeData);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // ===== search + filter derived list =====
  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return sensores.filter((s) => {
      if (statusFilter !== "ALL" && s.status !== statusFilter) return false;
      if (!qLower) return true;
      return (
        s.tipo.toLowerCase().includes(qLower) ||
        s.dispositivoId.toLowerCase().includes(qLower) ||
        s.id.toLowerCase().includes(qLower)
      );
    });
  }, [sensores, q, statusFilter]);

  // ===== handlers =====
  function openCreate() {
    setEditing(null);
    setOpenForm(true);
  }

  function handleEditClick(s: Sensor) {
    setEditing(s);
    setOpenForm(true);
  }

  function handleDeleteClick(s: Sensor) {
    const ok = confirm(`Deseja excluir o sensor "${s.tipo}" (${s.id})?`);
    if (!ok) return;
    setSensores((prev) => prev.filter((x) => x.id !== s.id));
    setMessage("Sensor excluído.");
    setTimeout(() => setMessage(null), 2500);
  }

  function handleSubmit(payload: any) {
    if (editing) {
      setSensores((prev) =>
        prev.map((it) => (it.id === editing.id ? { ...it, ...payload } : it))
      );
      setMessage("Sensor atualizado.");
    } else {
      const newSensor: Sensor = {
        id: `S${Date.now()}`,
        tipo: payload.tipo,
        status: payload.status,
        dispositivoId: payload.dispositivoId,
      };
      setSensores((prev) => [newSensor, ...prev]);
      setMessage("Sensor criado.");
    }
    setOpenForm(false);
    setEditing(null);
    setTimeout(() => setMessage(null), 2500);
  }

  // ===== UI states =====
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Sensores</h3>
          <p className="text-sm text-gray-500">
            Gerencie sensores registrados nos dispositivos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {message && (
            <div className="text-sm text-green-600 pr-3">{message}</div>
          )}

          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md shadow cursor-pointer"
            aria-label="Criar novo sensor"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Novo sensor
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex-1">
          <input
            type="search"
            placeholder="Pesquisar por tipo, dispositivo ou id..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border rounded-md px-3 py-2 bg-white"
            aria-label="Filtrar por status"
          >
            <option value="ALL">Todos</option>
            <option value="ATIVO">Ativos</option>
            <option value="INATIVO">Inativos</option>
          </select>
        </div>
      </div>

      {/* Table header */}
      <div className="hidden sm:grid grid-cols-6 gap-4 text-sm text-gray-500 border-b pb-2 mb-2">
        <div className="col-span-2">Tipo</div>
        <div>Dispositivo</div>
        <div>Status</div>
        <div>ID</div>
        <div className="text-right">Ações</div>
      </div>

      {/* List */}
      <ul className="space-y-2">
        {filtered.length === 0 ? (
          <li className="p-6 text-center text-gray-500">
            Nenhum sensor encontrado.
          </li>
        ) : (
          filtered.map((d) => (
            <li
              key={d.id}
              className="group border rounded-lg p-4 flex flex-col sm:grid sm:grid-cols-6 sm:items-center gap-3 sm:gap-4"
            >
              <div className="sm:col-span-2">
                <div className="font-medium text-gray-800">{d.tipo}</div>
                <div className="text-sm text-gray-500 hidden sm:block">
                  Sensor: {d.id}
                </div>
              </div>

              <div className="text-sm text-gray-600">{d.dispositivoId}</div>

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
                  aria-label={`Editar sensor ${d.tipo}`}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClick(d)}
                  className="px-2 py-1 text-sm rounded-md bg-red-50 hover:bg-red-100 text-red-700 cursor-pointer"
                  aria-label={`Excluir sensor ${d.tipo}`}
                >
                  Excluir
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* Modal Form */}
      {openForm && (
        <SensorForm
          initial={editing ?? undefined}
          onSubmit={(payload: any) => handleSubmit(payload)}
          onCancel={() => {
            setOpenForm(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
