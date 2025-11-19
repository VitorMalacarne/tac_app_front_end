"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [statusAviario, setStatusAviario] = useState<any>(null);
  const [ultimaLeitura, setUltimaLeitura] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const token = localStorage.getItem("cognito_token");

      // --- API Node (sensor de temperatura)
      const leituraRes = await fetch("http://localhost:3002/leituras/ultima", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const leituraJson = await leituraRes.json();
      setUltimaLeitura(leituraJson);

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
          {/* CARD: Última leitura do sensor */}
          <div className="p-6 rounded-lg shadow bg-white border">
            <h2 className="text-xl font-semibold mb-4">📡 Última Leitura</h2>

            {ultimaLeitura ? (
              <div>
                <p>
                  <strong>Temperatura:</strong> {ultimaLeitura.temperatura}°C
                </p>
                <p>
                  <strong>Capturado:</strong>{" "}
                  {new Date(ultimaLeitura.timestamp).toLocaleString()}
                </p>
              </div>
            ) : (
              <p>Nenhuma leitura disponível.</p>
            )}
          </div>

          {/* CARD: Status do aviário */}
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
          </div>
        </div>
      )}
    </div>
  );
}
