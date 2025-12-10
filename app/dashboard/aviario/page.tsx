// app/page.tsx

import AviarioList from "@/app/components/AviarioList";

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      {/* Título */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

      {/* Card Container */}
      <section className="bg-white shadow rounded-xl p-5">
        <AviarioList token="" />
      </section>
    </main>
  );
}
