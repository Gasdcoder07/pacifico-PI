import { NextResponse } from "next/server";
import cloudinary from "@/shared/lib/cloudinary";

const allowedFolders = [
    "productos",
    "sucursales",
    "empresas",
    "usuarios",
];

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { folder } = body;

        if (!folder || !allowedFolders.includes(folder)) {
            return NextResponse.json(
                { error: "Carpeta de Cloudinary no válida" },
                { status: 400 }
            );
        }

        const timestamp = Math.floor(Date.now() / 1000);

        const paramsToSign = {
            folder,
            timestamp,
        };

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET!
        );

        return NextResponse.json({
            signature,
            timestamp,
            folder,
            apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        });
    } catch (error) {
        console.error(
            "Error al generar firma de Cloudinary:",
            error
        );

        return NextResponse.json(
            { error: "No se pudo generar la firma de Cloudinary" },
            { status: 500 }
        );
    }
}