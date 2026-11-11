import { NextResponse } from "next/server";
import pool from "@/shared/lib/db";
import { supabase } from "@/shared/lib/supabase";
import {uploadCloudinaryImage,CloudinaryImageError} from "@/shared/utils/cloudinary-upload";
import cloudinary from "@/shared/lib/cloudinary";

/**
 * @swagger
 * /api/empresas/{id}:
 *   get:
 *     summary: Obtener una empresa por ID
 *     description: Obtiene la información de una empresa, incluyendo sus datos de Cloudinary.
 *     tags:
 *       - Empresas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único de la empresa
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Empresa obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Mi Empresa"
 *                     description:
 *                       type: string
 *                       nullable: true
 *                       example: "Empresa dedicada a la venta de productos"
 *                     address:
 *                       type: string
 *                       nullable: true
 *                       example: "Av. Principal #123"
 *                     status:
 *                       type: boolean
 *                       example: true
 *                     foto_public_id:
 *                       type: string
 *                       nullable: true
 *                       example: "empresas/abc123"
 *                     foto_url:
 *                       type: string
 *                       nullable: true
 *                       example: "https://res.cloudinary.com/demo/image/upload/v123/empresas/abc123.jpg"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: ID de empresa no válido.
 *       401:
 *         description: No autorizado o token inválido.
 *       403:
 *         description: No tienes permisos para consultar esta empresa.
 *       404:
 *         description: Empresa no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authHeader = request.headers.get("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "No autorizado. Falta el token de sesión" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];

        const {
            data: { user: authUser },
            error: authError,
        } = await supabase.auth.getUser(token);

        if (authError || !authUser) {
            return NextResponse.json(
                { error: "Sesión expirada o token inválido" },
                { status: 401 }
            );
        }

        const currentUserQuery = await pool.query(
            `SELECT id, company_id, rol_id
                FROM public.usuarios
                WHERE auth_user_id = $1
                    AND status = true`,
            [authUser.id]
        );

        const currentUser = currentUserQuery.rows[0];

        if (!currentUser) {
            return NextResponse.json(
                { error: "Usuario no encontrado o inactivo" },
                { status: 404 }
            );
        }

        const resolvedParams = await params;
        const companyId = parseInt(resolvedParams.id, 10);

        if (isNaN(companyId)) {
            return NextResponse.json(
                { error: "El ID de la empresa no es válido" },
                { status: 400 }
            );
        }

        if (Number(currentUser.company_id) !== companyId) {
            return NextResponse.json(
                { error: "No tienes permisos para consultar esta empresa" },
                { status: 403 }
            );
        }

        const result = await pool.query(
            `SELECT 
                id, name, description, address, status, foto_public_id, foto_url, created_at, updated_at
                FROM public.empresas
                WHERE id = $1`,
            [companyId]
        );

        if (!result.rows[0]) {
            return NextResponse.json(
                { error: "Empresa no encontrada" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            result.rows[0],
            { status: 200 }
        );
    } catch (error) {
        console.error("Error en GET /api/empresas/[id]:", error);

        return NextResponse.json(
            { error: "Error interno en el servidor" },
            { status: 500 }
        );
    }
}

/**
 * @swagger
 * /api/empresas/{id}:
 *   put:
 *     summary: Actualizar una empresa
 *     description: Actualiza los datos de una empresa, incluyendo su imagen almacenada en Cloudinary.
 *     tags:
 *       - Empresas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único de la empresa
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Mi Empresa Actualizada"
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "Nueva descripción de la empresa"
 *               address:
 *                 type: string
 *                 nullable: true
 *                 example: "Nueva dirección #456"
 *               foto_public_id:
 *                 type: string
 *                 nullable: true
 *                 example: "empresas/nueva-imagen"
 *               foto_url:
 *                 type: string
 *                 nullable: true
 *                 example: "https://res.cloudinary.com/demo/image/upload/v123/empresas/nueva-imagen.jpg"
 *     responses:
 *       200:
 *         description: Empresa actualizada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Mi Empresa Actualizada"
 *                     description:
 *                       type: string
 *                       nullable: true
 *                       example: "Nueva descripción de la empresa"
 *                     address:
 *                       type: string
 *                       nullable: true
 *                       example: "Nueva dirección #456"
 *                     status:
 *                       type: boolean
 *                       example: true
 *                     foto_public_id:
 *                       type: string
 *                       nullable: true
 *                       example: "empresas/nueva-imagen"
 *                     foto_url:
 *                       type: string
 *                       nullable: true
 *                       example: "https://res.cloudinary.com/demo/image/upload/v123/empresas/nueva-imagen.jpg"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Datos inválidos o ID de empresa no válido.
 *       401:
 *         description: No autorizado o token inválido.
 *       403:
 *         description: No tienes permisos para modificar esta empresa.
 *       404:
 *         description: Empresa no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    let newFotoPublicId: string | null = null;

    try {
        const authHeader = request.headers.get("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "No autorizado. Falta el token de sesión" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];

        const {
            data: { user: authUser },
            error: authError,
        } = await supabase.auth.getUser(token);

        if (authError || !authUser) {
            return NextResponse.json(
                { error: "Sesión expirada o token inválido" },
                { status: 401 }
            );
        }

        const currentUserQuery = await pool.query(
            `
            SELECT id, company_id, rol_id
            FROM public.usuarios
            WHERE auth_user_id = $1
                AND status = true
            `,
            [authUser.id]
        );

        const currentUser = currentUserQuery.rows[0];

        if (!currentUser) {
            return NextResponse.json(
                { error: "Usuario no encontrado o inactivo" },
                { status: 404 }
            );
        }

        // Solo el administrador puede modificar la empresa
        if (Number(currentUser.rol_id) !== 1) {
            return NextResponse.json(
                { error: "No tienes permisos para modificar la empresa" },
                { status: 403 }
            );
        }

        const resolvedParams = await params;
        const companyId = parseInt(resolvedParams.id, 10);

        if (!Number.isInteger(companyId) || companyId <= 0) {
            return NextResponse.json(
                { error: "El ID de la empresa no es válido" },
                { status: 400 }
            );
        }

        // El administrador solo puede modificar su propia empresa
        if (Number(currentUser.company_id) !== companyId) {
            return NextResponse.json(
                { error: "No tienes permisos para modificar esta empresa" },
                { status: 403 }
            );
        }

        const currentCompanyResult = await pool.query(
            `
            SELECT id, foto_public_id
            FROM public.empresas
            WHERE id = $1
            `,
            [companyId]
        );

        const currentCompany = currentCompanyResult.rows[0];

        if (!currentCompany) {
            return NextResponse.json(
                { error: "Empresa no encontrada" },
                { status: 404 }
            );
        }

        // Leer JSON o FormData
        const contentType = request.headers.get("content-type") ?? "";

        let body: Record<string, unknown>;
        let fotoFile: FormDataEntryValue | null = null;

        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();

            fotoFile = formData.get("foto");

            body = Object.fromEntries(
                Array.from(formData.entries()).filter(
                    ([key]) => key !== "foto"
                )
            );
        } else {
            body = await request.json();
        }

        // Los datos de Cloudinary no se reciben directamente
        if (
            body.foto_public_id !== undefined ||
            body.foto_url !== undefined
        ) {
            return NextResponse.json(
                { error: "La imagen debe enviarse mediante el campo foto" },
                { status: 400 }
            );
        }

        // Validaciones
        if (body.name !== undefined && typeof body.name !== "string") {
            return NextResponse.json(
                { error: "El nombre debe ser texto" },
                { status: 400 }
            );
        }

        if (
            body.description !== undefined &&
            body.description !== null &&
            typeof body.description !== "string"
        ) {
            return NextResponse.json(
                { error: "La descripción debe ser texto" },
                { status: 400 }
            );
        }

        if (
            body.address !== undefined &&
            body.address !== null &&
            typeof body.address !== "string"
        ) {
            return NextResponse.json(
                { error: "La dirección debe ser texto" },
                { status: 400 }
            );
        }

        const updates: string[] = [];
        const values: unknown[] = [];
        let paramIndex = 1;

        const fields = {
            name: body.name,
            description: body.description,
            address: body.address,
        };

        for (const [field, value] of Object.entries(fields)) {
            if (value !== undefined) {
                updates.push(`${field} = $${paramIndex}`);
                values.push(value);
                paramIndex++;
            }
        }

        // Subir imagen nueva a Cloudinary
        const uploadedImage = await uploadCloudinaryImage(
            fotoFile,
            `empresas/${companyId}`
        );

        if (uploadedImage) {
            newFotoPublicId = uploadedImage.foto_public_id;

            updates.push(`foto_url = $${paramIndex}`);
            values.push(uploadedImage.foto_url);
            paramIndex++;

            updates.push(`foto_public_id = $${paramIndex}`);
            values.push(uploadedImage.foto_public_id);
            paramIndex++;
        }

        if (updates.length === 0) {
            return NextResponse.json(
                { error: "No se enviaron campos para actualizar" },
                { status: 400 }
            );
        }

        updates.push("updated_at = NOW()");

        values.push(companyId);

        const result = await pool.query(
            `
            UPDATE public.empresas
            SET ${updates.join(", ")}
            WHERE id = $${paramIndex}
            RETURNING
                id,
                name,
                description,
                address,
                status,
                foto_public_id,
                foto_url,
                created_at,
                updated_at
            `,
            values
        );

        const updatedCompany = result.rows[0];

        if (!updatedCompany) {
            return NextResponse.json(
                { error: "Empresa no encontrada" },
                { status: 404 }
            );
        }

        // Eliminar imagen anterior después de actualizar PostgreSQL
        if (
            newFotoPublicId &&
            currentCompany.foto_public_id &&
            currentCompany.foto_public_id !== newFotoPublicId
        ) {
            try {
                await cloudinary.uploader.destroy(
                    currentCompany.foto_public_id
                );
            } catch (cloudinaryError) {
                console.error(
                    "Error al eliminar la imagen anterior:",
                    cloudinaryError
                );
            }
        }

        return NextResponse.json(
            {
                message: "Empresa actualizada con éxito",
                data: updatedCompany,
            },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error("Error en PUT /api/empresas/[id]:", error);

        // Limpiar imagen nueva si falla la actualización
        if (newFotoPublicId) {
            try {
                await cloudinary.uploader.destroy(newFotoPublicId);
            } catch (cleanupError) {
                console.error(
                    "Error al limpiar imagen de Cloudinary:",
                    cleanupError
                );
            }
        }

        if (error instanceof CloudinaryImageError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status }
            );
        }

        return NextResponse.json(
            { error: "Error interno en el servidor" },
            { status: 500 }
        );
    }
}
/**
 * @swagger
 * /api/empresas/{id}:
 *   delete:
 *     summary: Desactivar una empresa
 *     description: Desactiva una empresa cambiando su estado a false. Los registros relacionados se conservan y la imagen de Cloudinary no se elimina.
 *     tags:
 *       - Empresas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único de la empresa
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Empresa desactivada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Empresa desactivada con éxito"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Mi Empresa"
 *                     status:
 *                       type: boolean
 *                       example: false
 *                     foto_public_id:
 *                       type: string
 *                       nullable: true
 *                       example: "empresas/abc123"
 *                     foto_url:
 *                       type: string
 *                       nullable: true
 *                       example: "https://res.cloudinary.com/demo/image/upload/empresas/abc123.jpg"
 *       400:
 *         description: ID de empresa no válido.
 *       401:
 *         description: No autorizado o token inválido.
 *       403:
 *         description: No tienes permisos para desactivar esta empresa.
 *       404:
 *         description: Empresa no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authHeader = request.headers.get("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "No autorizado. Falta el token de sesión" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];

        const {
            data: { user: authUser },
            error: authError,
        } = await supabase.auth.getUser(token);

        if (authError || !authUser) {
            return NextResponse.json(
                { error: "Sesión expirada o token inválido" },
                { status: 401 }
            );
        }

        const currentUserQuery = await pool.query(
            `SELECT id, company_id, rol_id
                FROM public.usuarios
                WHERE auth_user_id = $1
                    AND status = true`,
            [authUser.id]
        );

        const currentUser = currentUserQuery.rows[0];

        if (!currentUser) {
            return NextResponse.json(
                { error: "Usuario no encontrado o inactivo" },
                { status: 404 }
            );
        }

        if (Number(currentUser.rol_id) !== 1) {
            return NextResponse.json(
                { error: "No tienes permisos para eliminar la empresa" },
                { status: 403 }
            );
        }

        const resolvedParams = await params;
        const companyId = parseInt(resolvedParams.id, 10);

        if (isNaN(companyId)) {
            return NextResponse.json(
                { error: "El ID de la empresa no es válido" },
                { status: 400 }
            );
        }

        if (Number(currentUser.company_id) !== companyId) {
            return NextResponse.json(
                { error: "No tienes permisos para eliminar esta empresa" },
                { status: 403 }
            );
        }

        const companyResult = await pool.query(
            `SELECT id, foto_public_id
                FROM public.empresas
                WHERE id = $1`,
            [companyId]
        );

        if (!companyResult.rows[0]) {
            return NextResponse.json(
                { error: "Empresa no encontrada" },
                { status: 404 }
            );
        }

        const result = await pool.query(
            `UPDATE public.empresas
                SET status = false,
                    updated_at = NOW()
                WHERE id = $1
                RETURNING id, name, status, foto_public_id, foto_url`,
                [companyId]
        );

        return NextResponse.json(
            {
                message: "Empresa desactivada con éxito",
                data: result.rows[0],
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error en DELETE /api/empresas/[id]:", error);

        return NextResponse.json(
            { error: "Error interno en el servidor" },
            { status: 500 }
        );
    }
}