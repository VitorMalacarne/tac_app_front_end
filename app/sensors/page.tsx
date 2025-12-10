"use client";

import { useEffect, useState } from "react";
import { API_EXPRESS } from "../const";

export default function LeiturasPage() {
  const [leituras, setLeituras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeituras = async () => {
    try {
      //const token = localStorage.getItem("cognito_token");
      console.log("fetch");
      const res = await fetch(`${API_EXPRESS}/leituras`, {
        headers: {
          Authorization: "123123",
        },
      });

      const data = await res.json();
      setLeituras(data);
    } catch (err) {
      console.error("Erro ao buscar leituras:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeituras();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">📡 Leituras do Sensor</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="table-auto w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Temperatura (°C)</th>
              <th className="border p-2">Horário</th>
            </tr>
          </thead>

          <tbody>
            {leituras.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="border p-2">{l.id}</td>
                <td className="border p-2">{l.temperatura}</td>
                <td className="border p-2">
                  {new Date(l.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
