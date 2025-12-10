// app/page.tsx

import SensorList from "@/app/components/SensorList";

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      {/* Título */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Sensores</h1>

      {/* Card Container */}
      <section className="bg-white shadow rounded-xl p-5">
        <SensorList token="" />
      </section>
    </main>
  );
}
