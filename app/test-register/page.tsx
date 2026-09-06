"use client";

import { useEffect, useState } from "react";

export default function TestRegister() {
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    email: "",
    password: "",
    rol_id: "",
    branch_id: "",
  });
  const [response, setResponse] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponse("Cargando...");

    try {

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          rol_id: Number(formData.rol_id),
          branch_id: formData.branch_id ? Number(formData.branch_id) : undefined,
        }),
      });

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(String(error));
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 border rounded-lg shadow-sm">
      <h1 className="text-xl font-bold mb-4">Probar Registro</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="name"
          placeholder="Nombre"
          onChange={handleChange}
          required
          className="p-2 border rounded text-black"
        />
        <input
          name="last_name"
          type="text"
          placeholder="Apellido"
          onChange={handleChange}
          required
          className="p-2 border rounded text-black"
        />
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
          type="text"
          placeholder="Contraseña"
          onChange={handleChange}
          required
          className="p-2 border rounded text-black"
        />
        <input
          name="rol_id"
          type="number"
          placeholder="ID del Rol"
          onChange={handleChange}
          required
          className="p-2 border rounded text-black"
        />
        <input
          name="branch_id"
          type="number"
          placeholder="ID de Sucursal (Opcional)"
          onChange={handleChange}
          className="p-2 border rounded text-black"
        />
        
        <button type="submit" className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Registrar Usuario
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