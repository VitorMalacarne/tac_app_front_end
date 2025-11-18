import { getSession, useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

type SensorData = { timestamp: string; temperature: number }[];
type AviaryStatus = { id: number; name: string; healthIndex: number }[];

export default function Home() {
  const { data: session } = useSession();
  const [sensor, setSensor] = useState<SensorData | null>(null);
  const [aviary, setAviary] = useState<AviaryStatus | null>(null);
  const token = (session as any)?.accessToken;

  useEffect(() => {
    if (!token) return;

    // buscar dados node (sensor)
    fetch(`${process.env.NEXT_PUBLIC_NODE_API_URL}/sensor/readings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then(setSensor)
      .catch(console.error);

    // buscar dados spring (aviario)
    fetch(`${process.env.NEXT_PUBLIC_SPRING_API_URL}/aviary/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then(setAviary)
      .catch(console.error);
  }, [token]);

  if (!session) return <div>Redirecionando para login...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl">Dashboard</h1>
        <div>
          <span className="mr-4">Olá, {session.user?.email}</span>
          <button
            onClick={() => signOut()}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Sair
          </button>
        </div>
      </div>

      <section className="mt-6">
        <h2 className="text-xl">Leituras do Sensor (Node)</h2>
        <pre className="bg-gray-50 p-4 rounded mt-2">
          {JSON.stringify(sensor, null, 2)}
        </pre>
      </section>

      <section className="mt-6">
        <h2 className="text-xl">Status do Aviário (Spring)</h2>
        <pre className="bg-gray-50 p-4 rounded mt-2">
          {JSON.stringify(aviary, null, 2)}
        </pre>
      </section>
    </div>
  );
}

// proteger via SSR (opcional — evita flicker)
export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  // não fazemos fetch SSR aqui porque o token pode não estar na sessão SSR facilmente
  return { props: {} };
}
