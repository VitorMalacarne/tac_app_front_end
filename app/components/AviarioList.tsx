"use client";

import { useEffect, useMemo, useState } from "react";
import type { Aviario } from "../models/Aviario";
import AviarioForm from "./AviarioForm";

interface AviarioListProps {
  token?: any;
}

export default function AviarioList({ token }: AviarioListProps) {
  const [aviarios, setAviarios] = useState<Aviario[]>([]);
  const [loading, setLoading] = useState(true);

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Aviario | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [ativoFilter, setAtivoFilter] = useState<"ALL" | "ATIVOS" | "INATIVOS">(
    "ALL"
  );

  // fake fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      const fakeData: Aviario[] = [
        {
          id: "A1",
          nome: "Aviário Central",
          capacidadeMaxima: 5000,
          localizacao: "Setor Norte",
          ativo: 1,
        },
        {
          id: "A2",
          nome: "Aviário Experimental",
          capacidadeMaxima: 2000,
          localizacao: "Setor Leste",
          ativo: 1,
        },
        {
          id: "A3",
          nome: "Aviário Antigo",
          capacidadeMaxima: 1500,
          localizacao: "Setor Sul",
          ativo: 0,
        },
      ];
      setAviarios(fakeData);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return aviarios.filter((a) => {
      if (ativoFilter === "ATIVOS" && a.ativo !== 1) return false;
      if (ativoFilter === "INATIVOS" && a.ativo !== 0) return false;
      if (!ql) return true;
      return (
        a.nome.toLowerCase().includes(ql) ||
        a.localizacao.toLowerCase().includes(ql) ||
        a.id.toLowerCase().includes(ql)
      );
    });
  }, [aviarios, q, ativoFilter]);

  // handlers
  function openCreate() {
    setEditing(null);
    setOpenForm(true);
  }

  function handleEditClick(a: Aviario) {
    setEditing(a);
    setOpenForm(true);
  }

  function handleDeleteClick(a: Aviario) {
    const ok = confirm(`Excluir aviário "${a.nome}" (${a.id})?`);
    if (!ok) return;
    setAviarios((prev) => prev.filter((x) => x.id !== a.id));
    setMessage("Aviário excluído.");
    setTimeout(() => setMessage(null), 2500);
  }

  function handleSubmit(payload: {
    nome: string;
    capacidadeMaxima: number;
    localizacao: string;
    ativo: number;
  }) {
    if (editing) {
      setAviarios((prev) =>
        prev.map((it) => (it.id === editing.id ? { ...it, ...payload } : it))
      );
      setMessage("Aviário atualizado.");
    } else {
      const newAviario: Aviario = {
        id: `A${Date.now()}`,
        nome: payload.nome,
        capacidadeMaxima: payload.capacidadeMaxima,
        localizacao: payload.localizacao,
        ativo: payload.ativo,
      };
      setAviarios((prev) => [newAviario, ...prev]);
      setMessage("Aviário criado.");
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
          <h3 className="text-lg font-semibold text-gray-800">Aviários</h3>
          <p className="text-sm text-gray-500">
            Gerencie os aviários e suas capacidades.
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
            placeholder="Pesquisar por nome, localização ou id..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={ativoFilter}
            onChange={(e) => setAtivoFilter(e.target.value as any)}
            className="border rounded-md px-3 py-2 bg-white cursor-pointer"
          >
            <option value="ALL">Todos</option>
            <option value="ATIVOS">Ativos</option>
            <option value="INATIVOS">Inativos</option>
          </select>
        </div>
      </div>

      <div className="hidden sm:grid grid-cols-5 gap-4 text-sm text-gray-500 border-b pb-2 mb-2">
        <div>Nome</div>
        <div>Localização</div>
        <div>Capacidade</div>
        <div>Ativo</div>
        <div className="text-right">Ações</div>
      </div>

      <ul className="space-y-3">
        {filtered.length === 0 ? (
          <li className="p-6 text-center text-gray-500">
            Nenhum aviário encontrado.
          </li>
        ) : (
          filtered.map((a) => (
            <li
              key={a.id}
              className="group border rounded-lg p-4 flex flex-col sm:grid sm:grid-cols-5 sm:items-center gap-3 sm:gap-4"
            >
              <div className="font-medium text-gray-800">{a.nome}</div>
              <div className="text-sm text-gray-600">{a.localizacao}</div>
              <div className="text-sm text-gray-600">
                {a.capacidadeMaxima.toLocaleString()}
              </div>
              <div>
                <span
                  className={`inline-flex items-center gap-2 px-2 py-1 text-xs font-semibold rounded-full ${
                    a.ativo
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      a.ativo ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  {a.ativo ? "Ativo" : "Inativo"}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => handleEditClick(a)}
                  className="px-2 py-1 text-sm rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 cursor-pointer"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClick(a)}
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
        <AviarioForm
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
