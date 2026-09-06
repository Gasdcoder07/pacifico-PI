"use client";

import { useState } from "react";

export default function TestLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [response, setResponse] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponse("Cargando...");

    console.log("Enviando datos de login:", formData);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(String(error));
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 border rounded-lg shadow-sm">
      <h1 className="text-xl font-bold mb-4">Probar Login</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="email"
          type="email"
          placeholder="Correo"
          onChange={handleChange}
          required
          className="p-2 border rounded text-black"
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          onChange={handleChange}
          required
          className="p-2 border rounded text-black"
        />
        
        <button type="submit" className="p-2 bg-green-600 text-white rounded hover:bg-green-700">
          Iniciar Sesión
        </button>
      </form>

      {response && (
        <pre className="mt-6 p-4 bg-gray-100 text-gray-800 rounded text-sm overflow-auto">
          {response}
        </pre>
      )}
    </div>
  );
}