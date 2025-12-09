"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [statusAviario, setStatusAviario] = useState<any>(null);
  const [leituras, setLeituras] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const token = process.env.TOKEN_BEARER;

      // --- API Node (sensor de temperatura)
      const leituraRes = await fetch(
        "http://192.168.30.64/api/express/leituras",
        {
          headers: {
            Authorization: `123123`,
          },
        }
      );
      const leituraJson = await leituraRes.json();
      console.log(leituraJson);
      setLeituras(leituraJson);

      // --- API Spring Boot (bem-estar animal)
      const aviarioRes = await fetch("http://localhost:8080/aviario/status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const aviarioJson = await aviarioRes.json();
      setStatusAviario(aviarioJson);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard Geral</h1>

      {loading ? (
        <p>Carregando dados...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg shadow bg-white border">
            <h2 className="text-xl font-semibold mb-4">📡 Leituras</h2>

            {Array.isArray(leituras) && leituras.length > 0 ? (
              leituras.map((element: any, idx: number) => (
                <div
                  key={element._id ?? `${element.idSensor}-${idx}`}
                  className="mb-4"
                >
                  <p>Sensor: {element.idSensor}</p>
                  <p>
                    <strong>Temperatura:</strong> {element.leitura}°C
                  </p>
                </div>
              ))
            ) : (
              <p>Nenhuma leitura disponível.</p>
            )}
          </div>
          {/*
          <div className="p-6 rounded-lg shadow bg-white border">
            <h2 className="text-xl font-semibold mb-4">🐔 Status do Aviário</h2>

            {statusAviario ? (
              <div>
                <p>
                  <strong>Total de Galinhas:</strong>{" "}
                  {statusAviario.totalGalinhas}
                </p>
                <p>
                  <strong>Nível de Amônia:</strong> {statusAviario.nivelAmonia}{" "}
                  ppm
                </p>
                <p>
                  <strong>Condição:</strong> {statusAviario.condicao}
                </p>
              </div>
            ) : (
              <p>Sem dados do Spring Boot.</p>
            )}
          </div>*/}
        </div>
      )}
    </div>
  );
}
