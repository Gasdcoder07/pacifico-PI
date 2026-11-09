
import cloudinary from "@/shared/lib/cloudinary";

export class CloudinaryImageError extends Error {
    status: number;

    constructor(message: string, status = 400) {
        super(message);
        this.name = "CloudinaryImageError";
        this.status = status;
    }
}

export async function uploadCloudinaryImage(
    file: FormDataEntryValue | null,
    folder: string
): Promise<{ foto_url: string; foto_public_id: string } | null> {
    if (file === null || file === "") return null;

    if (!(file instanceof File)) {
        throw new CloudinaryImageError("El archivo de imagen no es válido");
    }

    if (file.size === 0) return null;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
        throw new CloudinaryImageError(
            "Solo se permiten imágenes JPG, PNG o WEBP"
        );
    }

    if (file.size > 5 * 1024 * 1024) {
        throw new CloudinaryImageError(
            "La imagen no debe superar los 5 MB"
        );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<{
        secure_url: string;
        public_id: string;
    }>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder, resource_type: "image" },
            (error, uploaded) => {
                if (error || !uploaded) {
                    reject(error ?? new Error("Error al subir la imagen"));
                    return;
                }

                resolve({
                    secure_url: uploaded.secure_url,
                    public_id: uploaded.public_id,
                });
            }
        ).end(buffer);
    });

    return {
        foto_url: result.secure_url,
        foto_public_id: result.public_id,
    };
}
