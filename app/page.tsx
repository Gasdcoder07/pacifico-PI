"use client";

import { CustomContainer } from "@/components/CustomContainer";
import { useState } from "react";
import ProfilePfp from "@/components/ProfilePfp";

export default function Home() {
    const [response, setResponse] = useState<string>("Cargando datos...");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/meter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mensaje: "Hola desde el cliente" }),
      });
      const json = await res.json();
      setResponse(JSON.stringify(json.data.mesaje, null, 2));
      console.log(res)
    } catch (err) {
      console.error(err);
      setResponse("Error al cargar los datos");
    }
  };

  return (
    <div>
      <main>
        <div className="flex flex-row align-middle items-end mb-10 justify-between px-4 py-2">
          <h1 className="text-zinc-700 font-bold text-5xl">Mi punto de venta</h1>
          <ProfilePfp name="Nadia Ruiz" role="Administrador" avatarUrl="https://i.pravatar.cc/150?img=12" />
        </div>
        <h1>{response}</h1>
        <div className="flex flex-row">
          <CustomContainer w={50} bigg={true} />
          <CustomContainer w={30} bigg={true} />
        </div>
        <div className="flex flex-col py-20">
          <h2 className="text-base font-semibold">Este botón solo es una prueba para la API, método POST</h2>
          <button onClick={() => fetchData()} className="w-32 h-16 bg-zinc-900/20 rounded-2xl text-zinc-700 text-2xl hover:scale-120 transition-all">Enviar</button>
        </div>
      </main>
    </div>
  );
}
