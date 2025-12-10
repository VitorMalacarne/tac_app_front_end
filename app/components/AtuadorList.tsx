"use client";

import { useEffect, useState } from "react";
import { API_SPRING } from "../const";
import { Atuador } from "../models/Atuador";
import AtuadorForm from "./AtuadorForm";

interface AtuadorListProps {
  token: any;
}

export default function AtuadorList({ token }: AtuadorListProps) {
  const [atuadores, setAtuadores] = useState<Atuador[]>([]);
  const [loading, setLoading] = useState(true);

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Atuador | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // FETCH FALSO (TEMPORÁRIO)
  useEffect(() => {
    const timer = setTimeout(() => {
      const fakeData: Atuador[] = [
        {
          id: "AT1",
          tipo: "Ventilador",
          status: "LIGADO",
          dispositivoId: "D1",
        },
        {
          id: "AT2",
          tipo: "Nebulizador",
          status: "DESLIGADO",
          dispositivoId: "D2",
        },
        {
          id: "AT3",
          tipo: "Aquecedor",
          status: "DESLIGADO",
          dispositivoId: "D3",
        },
      ];

      setAtuadores(fakeData);
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  /* -------- REAL FETCH (com Cognito token) ----------
  useEffect(() => {
    if (!token) return;

    const fetchAtuadores = async () => {
      try {
        const res = await fetch(`${API_SPRING}/atuadores?page=0&size=5`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error("Falha ao carregar atuadores");

        const data = await res.json();
        setAtuadores(data.content || data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchAtuadores();
  }, [token]);
  --------------------------------------------------- */

  if (loading) return <p>Carregando atuadores...</p>;
  if (!atuadores.length) return <p>Nenhum atuador encontrado.</p>;

  function handleCreateClick() {
    setEditing(null);
    setOpenForm(true);
  }

  function handleEditClick(a: Atuador) {
    setEditing(a);
    setOpenForm(true);
  }

  function handleDeleteClick(a: Atuador) {
    const ok = confirm(`Excluir atuador ${a.tipo} (${a.id})?`);
    if (!ok) return;

    setAtuadores((prev) => prev.filter((x) => x.id !== a.id));
    setMessage("Atuador excluído.");
    setTimeout(() => setMessage(null), 2500);
  }

  function handleSubmit(payload: any) {
    if (editing) {
      // editar
      setAtuadores((prev) =>
        prev.map((s) => (s.id === editing.id ? { ...s, ...payload } : s))
      );
      setMessage("Atuador atualizado.");
    } else {
      // criar
      const newAtuador: Atuador = {
        id: `AT${Date.now()}`,
        tipo: payload.tipo,
        status: payload.status,
        dispositivoId: payload.dispositivoId,
      };
      setAtuadores((prev) => [newAtuador, ...prev]);
      setMessage("Atuador criado.");
    }

    setOpenForm(false);
    setEditing(null);
    setTimeout(() => setMessage(null), 2500);
  }

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Atuadores</h3>

        <div className="flex items-center gap-3">
          {message && (
            <div className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
              {message}
            </div>
          )}

          <button
            onClick={handleCreateClick}
            className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700 cursor-pointer transition"
          >
            + Novo
          </button>
        </div>
      </div>

      <ul className="space-y-3">
        {atuadores.map((a) => (
          <li
            key={a.id}
            className="border rounded-lg p-4 bg-white shadow-sm flex items-center justify-between"
          >
            <div>
              <div className="font-medium text-gray-800">{a.tipo}</div>
              <div className="text-sm text-gray-500">
                Dispositivo: {a.dispositivoId}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-sm font-medium ${
                  a.status === "LIGADO" ? "text-green-600" : "text-gray-500"
                }`}
              >
                {a.status}
              </span>

              <button
                onClick={() => handleEditClick(a)}
                className="px-3 py-1 text-sm rounded bg-blue-100 hover:bg-blue-200 cursor-pointer"
              >
                Editar
              </button>

              <button
                onClick={() => handleDeleteClick(a)}
                className="px-3 py-1 text-sm rounded bg-red-100 hover:bg-red-200 cursor-pointer"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>

      {openForm && (
        <AtuadorForm
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
