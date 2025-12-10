"use client";

import { useEffect, useMemo, useState } from "react";
import { API_SPRING } from "../const";
import type { Lote } from "../models/Lote";
import LoteForm from "./LoteForm";

interface LoteListProps {
  token?: any;
}

export default function LoteList({ token }: LoteListProps) {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Lote | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const [q, setQ] = useState("");

  // fake fetch
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     const fakeData: Lote[] = [
  //       { id: "1", descricao: "Lote Inicial", aviarioId: "A1" },
  //       { id: "2", descricao: "Lote de Teste", aviarioId: "A2" },
  //       { id: "3", descricao: "Lote Premium", aviarioId: "A3" },
  //     ];
  //     setLotes(fakeData);
  //     setLoading(false);
  //   }, 500);

  //   return () => clearTimeout(timer);
  // }, []);

  useEffect(() => {
    if (!token) return;
    const fetchLotes = async () => {
      try {
        const res = await fetch(`${API_SPRING}/lotes?page=0&size=5`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (!res.ok) throw new Error("Falha ao carregar lotes");
        const data = await res.json();
        setLotes(data.content || data); // depende da sua API
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchLotes();
  }, [token]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return lotes.filter((l) => {
      if (!ql) return true;
      return (
        l.descricao.toLowerCase().includes(ql) ||
        l.aviarioId.toLowerCase().includes(ql) ||
        l.id.toLowerCase().includes(ql)
      );
    });
  }, [lotes, q]);

  // handlers
  function openCreate() {
    setEditing(null);
    setOpenForm(true);
  }

  function handleEditClick(l: Lote) {
    setEditing(l);
    setOpenForm(true);
  }

  async function handleDeleteClick(l: Lote) {
    const ok = confirm(`Excluir lote "${l.descricao}" (${l.id})?`);
    if (!ok) return;

    const t = token ?? localStorage.getItem("accessToken");
    if (!t) {
      setMessage("Token ausente. Faça login.");
      setTimeout(() => setMessage(null), 2500);
      return;
    }

    try {
      const res = await fetch(`${API_SPRING}/lotes/${l.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${t}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(errText || "Falha ao excluir lote");
      }

      // sucesso: remover localmente
      setLotes((prev) => prev.filter((x) => x.id !== l.id));
      setMessage("Lote excluído.");
    } catch (err: any) {
      console.error("Lote delete error:", err);
      setMessage(err?.message || "Erro ao excluir lote");
    } finally {
      setTimeout(() => setMessage(null), 2500);
    }
  }

  async function handleSubmit(payload: {
    descricao: string;
    aviarioId: string;
  }) {
    const t = token ?? localStorage.getItem("accessToken");
    if (!t) {
      setMessage("Token ausente. Faça login.");
      setTimeout(() => setMessage(null), 2500);
      return;
    }

    setSubmitting(true);
    try {
      if (editing) {
        // Editar (PUT)
        const res = await fetch(`${API_SPRING}/lotes/${editing.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${t}`,
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errText = await res.text().catch(() => "");
          throw new Error(errText || "Falha ao atualizar lote");
        }

        const updated = await res
          .json()
          .catch(() => ({ id: editing.id, ...payload }));
        setLotes((prev) =>
          prev.map((it) => (it.id === editing.id ? updated : it))
        );
        setMessage("Lote atualizado.");
      } else {
        // Criar (POST)
        const res = await fetch(`${API_SPRING}/lotes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${t}`,
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errText = await res.text().catch(() => "");
          throw new Error(errText || "Falha ao criar lote");
        }

        const created = await res
          .json()
          .catch(() => ({ id: `${Date.now()}`, ...payload }));
        setLotes((prev) => [created, ...prev]);
        setMessage("Lote criado.");
      }
    } catch (err: any) {
      console.error("Lote save error:", err);
      setMessage(
        typeof err === "string" ? err : err.message || "Erro ao salvar lote"
      );
    } finally {
      setSubmitting(false);
      setOpenForm(false);
      setEditing(null);
      setTimeout(() => setMessage(null), 2500);
    }
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
          <h3 className="text-lg font-semibold text-gray-800">Lotes</h3>
          <p className="text-sm text-gray-500">
            Gerencie lotes e associe aos aviários.
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

      <div className="flex items-center gap-3 mb-4">
        <input
          type="search"
          placeholder="Pesquisar por descrição, aviário ou id..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div className="hidden sm:grid grid-cols-3 gap-4 text-sm text-gray-500 border-b pb-2 mb-2">
        <div>Descrição</div>
        <div>Aviário</div>
        <div className="text-right">Ações</div>
      </div>

      <ul className="space-y-3">
        {filtered.length === 0 ? (
          <li className="p-6 text-center text-gray-500">
            Nenhum lote encontrado.
          </li>
        ) : (
          filtered.map((l) => (
            <li
              key={l.id}
              className="group border rounded-lg p-4 flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-3 sm:gap-4"
            >
              <div className="font-medium text-gray-800">{l.descricao}</div>
              <div className="text-sm text-gray-600">{l.aviarioId}</div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => handleEditClick(l)}
                  className="px-2 py-1 text-sm rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 cursor-pointer"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClick(l)}
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
        <LoteForm
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
