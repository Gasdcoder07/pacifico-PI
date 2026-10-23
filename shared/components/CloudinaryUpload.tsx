"use client";

import { useState } from "react";

type CloudinaryUploadProps = {
    folder: "productos" | "sucursales" | "empresas" | "usuarios";
    onUpload: (data: {
        public_id: string;
        secure_url: string;
    }) => void;
};

export default function CloudinaryUpload({
    folder,
    onUpload,
}: CloudinaryUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setError(null);

        if (!file.type.startsWith("image/")) {
            setError("El archivo debe ser una imagen.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("La imagen no puede superar los 5 MB.");
            return;
        }

        try {
            setUploading(true);

            // Vista previa
            setPreview(URL.createObjectURL(file));

            // Obtener firma
            const signatureResponse = await fetch(
                "/api/cloudinary/signature",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        folder,
                    }),
                }
            );

            if (!signatureResponse.ok) {
                throw new Error("No se pudo obtener la firma.");
            }

            const signatureData = await signatureResponse.json();

            // Preparar archivo para Cloudinary
            const formData = new FormData();

            formData.append("file", file);
            formData.append("api_key", signatureData.apiKey);
            formData.append("timestamp", signatureData.timestamp);
            formData.append("signature", signatureData.signature);
            formData.append("folder", signatureData.folder);

            // Subir directamente a Cloudinary
            const uploadResponse = await fetch(
                `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!uploadResponse.ok) {
                throw new Error("No se pudo subir la imagen.");
            }

            const cloudinaryData = await uploadResponse.json();

            // Regresar datos al formulario
            onUpload({
                public_id: cloudinaryData.public_id,
                secure_url: cloudinaryData.secure_url,
            });
        } catch (error) {
            console.error("Error al subir imagen:", error);

            setPreview(null);
            setError("No se pudo subir la imagen.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
            />

            {uploading && (
                <p>Subiendo imagen...</p>
            )}

            {preview && (
                <img
                    src={preview}
                    alt="Vista previa"
                    className="h-40 w-40 rounded-lg object-cover"
                />
            )}

            {error && (
                <p className="text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}