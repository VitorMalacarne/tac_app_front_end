"use client";

import { useEffect, useState } from "react";
import { API_EXPRESS } from "../const";
import { Leitura } from "../models/Leitura";

interface LeituraListProps {
  token: any;
}

export default function LeituraList({ token }: LeituraListProps) {
  const [leituras, setLeituras] = useState<Leitura[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH FALSO (TEMPORÁRIO)
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     const fakeData: Leitura[] = [
  //       { id: "1", tipoSensor: "Leitura Inicial", leitura: "A1" },
  //       { id: "2", tipoSensor: "Leitura de Teste", leitura: "A2" },
  //       { id: "3", tipoSensor: "Leitura Premium", leitura: "A3" },
  //     ];

  //     setLeituras(fakeData);
  //     setLoading(false);
  //   }, 700); // simular carregamento

  //   return () => clearTimeout(timer);
  // }, []);

  // FETCH REAL

  useEffect(() => {
    if (!token) return;

    const fetchLeituras = async () => {
      try {
        const res = await fetch(`${API_EXPRESS}/leituras?page=0&size=5`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error("Falha ao carregar leituras");

        const data = await res.json();
        setLeituras(data.content || data); // depende da sua API
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchLeituras();
  }, [token]);

  if (loading) return <p>Carregando leituras...</p>;
  if (!leituras.length) return <p>Nenhum leitura encontrado.</p>;

  return (
    <ul className="space-y-2">
      {leituras.map((d) => (
        <li key={d.id} className="border p-2 rounded flex justify-between">
          <span>Tipo do Sensor: {d.tipoSensor}</span>
          <span>Leitura: {d.leitura}</span>
        </li>
      ))}
    </ul>
  );
}
