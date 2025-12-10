"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="p-4 border-b flex gap-4 bg-gray-100">
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/dashboard/sensor">Sensores</Link>
      <Link href="/dashboard/aviario">Aviários</Link>
      <Link href="/dashboard/dispositivo">Dispositivos</Link>
      <Link href="/dashboard/lote">Lotes</Link>
      <Link href="/dashboard/pessoa">Pessoas</Link>
      <Link href="/dashboard/atuador">Atuadores</Link>
      <Link href="/dashboard/leitura">Leituras</Link>
    </nav>
  );
}
