import { pool } from "@/shared/lib/db";
import { supabase, supabaseAdmin } from "@/shared/lib/supabase";
import { NextResponse } from "next/server";
import {uploadCloudinaryImage,CloudinaryImageError} from "@/shared/utils/cloudinary-upload";
import cloudinary from "@/shared/lib/cloudinary";

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     description: Consulta la base de datos y devuelve los detalles de un usuario específico usando su ID. Requiere autenticación mediante token JWT en los headers.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único del usuario a consultar
 *         schema:
 *           type: integer
 *           example: 37
 *     responses:
 *       200:
 *         description: Datos de cuenta recibidos con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Datos de cuenta recibidos con éxito"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 37
 *                     name:
 *                       type: string
 *                       example: "Valentín"
 *                     last_name:
 *                       type: string
 *                       example: "Vaca"
 *                     email:
 *                       type: string
 *                       example: "vvaca2@ucol.mx"
 *                     rol_id:
 *                       type: integer
 *                       example: 2
 *                     branch_id:
 *                       type: integer
 *                       nullable: true
 *                       example: null
 *                     status:
 *                       type: boolean
 *                       example: true
 *                     foto_url:
 *                       type: string
 *                       nullable: true
 *                       example: "https://ejemplo.com/foto.jpg"
 *                     admin_id:
 *                       type: integer
 *                       nullable: true
 *                       example: 1
 *                     manager_id:
 *                       type: integer
 *                       nullable: true
 *                       example: null
 *       400:
 *         description: Bad Request. El ID proporcionado en la URL no es un número.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Has ingresado un parámetro que no es un número"
 *       401:
 *         description: Unauthorized. Falta el token de sesión o el token es inválido/expirado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Sesión expirada o token inválido"
 *       404:
 *         description: Not Found. No existe un usuario con el ID especificado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No existe un usuario con ese ID"
 *       500:
 *         description: Internal Server Error. Fallo en el servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno en el servidor"
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

        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !authUser) {
            return NextResponse.json(
                { error: "Sesión expirada o token inválido" },
                { status: 401 }
            );
        }

        const resolvedParams = await params;
        const userId = parseInt(resolvedParams.id, 10);

        if (isNaN(userId)) {
            return NextResponse.json(
                { error: "Has ingresado un parámetro que no es un número" },
                { status: 400 }
            );
        }

        const response = await pool.query(
            `
            SELECT 
                u.id,
                u.name,
                u.last_name,
                u.email,
                u.rol_id,
                u.branch_id,
                u.status,
                e.foto_url as company_image,
                CASE 
                    WHEN u.rol_id IN (1, 3) THEN e.name
                    ELSE s.name
                END AS context_name
            FROM usuarios u
            LEFT JOIN empresas e ON e.id = u.company_id
            LEFT JOIN sucursales s ON s.id = u.branch_id
            WHERE u.id = $1;
            `,
            [userId]
        );

        const user = response.rows[0];

        if (!user) {
            return NextResponse.json(
                { error: "No existe un usuario con ese ID" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Datos de cuenta recibidos con éxito", data: user },
            { status: 200 }
        );
    } catch (err) {
        console.error("Error en GET /api/usuarios/[id]:", err);
        return NextResponse.json(
            { error: "Error interno en el servidor" },
            { status: 500 }
        );
    }
}

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario por ID
 *     description: Actualiza la información de un usuario. Un Admin (rol 1) puede editar a cualquiera. Un Gerente (rol 2) solo puede editar usuarios con rol 3 de su misma sucursal.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a actualizar
 *         schema:
 *           type: integer
 *           example: 37
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Valentín"
 *               last_name:
 *                 type: string
 *                 example: "Vaca"
 *               email:
 *                 type: string
 *                 example: "vvaca2@ucol.mx"
 *               status:
 *                 type: boolean
 *                 example: true
 *               foto_url:
 *                 type: string
 *                 example: "https://ejemplo.com/foto.jpg"
 *               rol_id:
 *                 type: integer
 *                 example: 2
 *               branch_id:
 *                 type: integer
 *                 example: 1
 *               admin_id:
 *                 type: integer
 *                 example: 1
 *               manager_id:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario actualizado con éxito"
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad Request. Datos no válidos, intento de modificar el propio rol o asignar rol_id 1.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No puedes modificar tu propio rol_id"
 *       401:
 *         description: Unauthorized. Falta token de sesión o token inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Sesión expirada o token inválido"
 *       403:
 *         description: Forbidden. No tienes permisos para editar a este usuario (por rol o sucursal) o para modificar el rol.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No tienes permiso para editar a este usuario"
 *       404:
 *         description: Not Found. Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No existe un usuario con ese ID"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno en el servidor"
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
                { error: "No estás autorizado para realizar esta petición" },
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
            `SELECT id, rol_id, branch_id
                FROM public.usuarios
                WHERE auth_user_id = $1`,
            [authUser.id]
        );

        const currentUser = currentUserQuery.rows[0];

        if (!currentUser) {
            return NextResponse.json(
                { error: "No se encontró un perfil de usuario asociado a esta sesión" },
                { status: 404 }
            );
        }

        const resolvedParams = await params;
        const userId = parseInt(resolvedParams.id, 10);

        if (!Number.isInteger(userId) || userId <= 0) {
            return NextResponse.json(
                { error: "Has ingresado un parámetro que no es válido" },
                { status: 400 }
            );
        }

        const targetUserQuery = await pool.query(
            `SELECT id, rol_id, branch_id, foto_public_id
                FROM public.usuarios
                WHERE id = $1`,
            [userId]
        );

        const targetUser = targetUserQuery.rows[0];

        if (!targetUser) {
            return NextResponse.json(
                { error: "No existe un usuario con ese ID" },
                { status: 404 }
            );
        }

        // Validar permisos
        if (Number(currentUser.id) !== userId) {
            if (Number(currentUser.rol_id) === 3) {
                return NextResponse.json(
                    { error: "No tienes permisos para editar a otros usuarios" },
                    { status: 403 }
                );
            }

            if (Number(currentUser.rol_id) === 2) {
                if (Number(targetUser.rol_id) !== 3) {
                    return NextResponse.json(
                        { error: "Como gerente solo puedes editar usuarios con rol 3" },
                        { status: 403 }
                    );
                }

                if (Number(targetUser.branch_id) !== Number(currentUser.branch_id)) {
                    return NextResponse.json(
                        { error: "Solo puedes editar usuarios de tu misma sucursal" },
                        { status: 403 }
                    );
                }
            }
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

        // No permitir modificar directamente los datos de Cloudinary
        if (
            body.foto_url !== undefined ||
            body.foto_public_id !== undefined
        ) {
            return NextResponse.json(
                { error: "La imagen debe enviarse mediante el campo foto" },
                { status: 400 }
            );
        }

        // Validar y convertir campos numéricos de FormData
        const numericFields = [
            "rol_id",
            "branch_id",
            "admin_id",
            "manager_id",
        ];

        for (const field of numericFields) {
            if (typeof body[field] === "string") {
                const value = body[field] as string;

                if (value === "" || value === "null") {
                    body[field] = null;
                } else {
                    const parsed = Number(value);

                    if (!Number.isInteger(parsed)) {
                        return NextResponse.json(
                            { error: `${field} debe ser un número entero` },
                            { status: 400 }
                        );
                    }

                    body[field] = parsed;
                }
            }
        }

        if (typeof body.status === "string") {
            if (body.status !== "true" && body.status !== "false") {
                return NextResponse.json(
                    { error: "status debe ser true o false" },
                    { status: 400 }
                );
            }

            body.status = body.status === "true";
        }

        // Validar modificación de rol
        if (body.rol_id !== undefined) {
            const newRolId = Number(body.rol_id);

            if (Number(currentUser.id) === userId) {
                return NextResponse.json(
                    { error: "No puedes modificar tu propio rol_id" },
                    { status: 400 }
                );
            }

            if (Number(currentUser.rol_id) !== 1) {
                return NextResponse.json(
                    { error: "No tienes permiso para modificar el rol_id" },
                    { status: 403 }
                );
            }

            if (newRolId === 1) {
                return NextResponse.json(
                    { error: "No puedes asignar el rol de administrador a un usuario" },
                    { status: 400 }
                );
            }
        }

        const allowedFields = [
            "name",
            "last_name",
            "email",
            "status",
            "rol_id",
            "branch_id",
            "admin_id",
            "manager_id",
        ];

        const updates: string[] = [];
        const values: unknown[] = [];
        let paramIndex = 1;

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updates.push(`${field} = $${paramIndex}`);
                values.push(body[field]);
                paramIndex++;
            }
        }

        // Subir imagen si se recibió una
        const uploadedImage = await uploadCloudinaryImage(
            fotoFile,
            `usuarios/${userId}`
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
                { error: "No se enviaron campos válidos para actualizar" },
                { status: 400 }
            );
        }

        updates.push("updated_at = NOW()");

        values.push(userId);

        const response = await pool.query(
            `
            UPDATE public.usuarios
            SET ${updates.join(", ")}
            WHERE id = $${paramIndex}
            RETURNING
                id, name, last_name, email, rol_id,
                branch_id, status, foto_url, foto_public_id,
                admin_id, manager_id, company_id, updated_at
            `,
            values
        );

        const updatedUser = response.rows[0];

        if (!updatedUser) {
            return NextResponse.json(
                { error: "No existe un usuario con ese ID" },
                { status: 404 }
            );
        }

        // Eliminar imagen anterior después de actualizar PostgreSQL
        if (
            newFotoPublicId &&
            targetUser.foto_public_id &&
            targetUser.foto_public_id !== newFotoPublicId
        ) {
            try {
                await cloudinary.uploader.destroy(targetUser.foto_public_id);
            } catch (cloudinaryError) {
                console.error(
                    "Error al eliminar la imagen anterior:",
                    cloudinaryError
                );
            }
        }

        return NextResponse.json(
            {
                message: "Usuario actualizado con éxito",
                data: updatedUser,
            },
            { status: 200 }
        );

    } catch (err: unknown) {
        console.error("Error en PUT /api/usuarios/[id]:", err);

        // Limpiar imagen nueva si ocurrió un error al actualizar PostgreSQL
        if (newFotoPublicId) {
            try {
                await cloudinary.uploader.destroy(newFotoPublicId);
            } catch (cleanupError) {
                console.error("Error al limpiar imagen de Cloudinary:", cleanupError);
            }
        }

        if (err instanceof CloudinaryImageError) {
            return NextResponse.json(
                { error: err.message },
                { status: err.status }
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
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario por ID
 *     description: Elimina un usuario de la base de datos de PostgreSQL y de Supabase Auth. Un Admin (rol 1) puede eliminar a cualquiera excepto a otros Admins. Un Gerente (rol 2) solo puede eliminar usuarios con rol 3 de su misma sucursal.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único del usuario a eliminar
 *         schema:
 *           type: integer
 *           example: 38
 *     responses:
 *       200:
 *         description: Usuario eliminado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario eliminado con éxito"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 38
 *                     name:
 *                       type: string
 *                       example: "Carlos"
 *                     last_name:
 *                       type: string
 *                       example: "Gómez"
 *                     email:
 *                       type: string
 *                       example: "carlos@ejemplo.com"
 *       400:
 *         description: Bad Request. El ID no es válido, intentas borrar tu propia cuenta o intentas borrar a un Administrador.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No es posible eliminar a un usuario con rol de Administrador (rol_id: 1)"
 *       401:
 *         description: Unauthorized. Falta token de sesión o token inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Sesión expirada o token inválido"
 *       403:
 *         description: Forbidden. No tienes permisos para eliminar (por jerarquía o sucursal).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No tienes permisos para eliminar a este usuario"
 *       404:
 *         description: Not Found. No existe un usuario con ese ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No existe un usuario con ese ID"
 *       409:
 *         description: Conflict. El usuario tiene registros vinculados por llave foránea.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No se puede eliminar el usuario porque tiene registros vinculados asignados"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno en el servidor al eliminar el usuario"
 */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authHeader = request.headers.get("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "No autorizado. Falta token de sesión" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];

        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !authUser) {
            return NextResponse.json(
                { error: "Sesión expirada o token inválido" },
                { status: 401 }
            );
        }

        const currentUserQuery = await pool.query(
            `SELECT id, rol_id, branch_id FROM usuarios WHERE auth_user_id = $1`,
            [authUser.id]
        );

        const currentUser = currentUserQuery.rows[0];

        if (!currentUser) {
            return NextResponse.json(
                { error: "No se encontró perfil de usuarios asociado a esta sesión" },
                { status: 404 }
            );
        }

        if (Number(currentUser.rol_id) === 3) {
            return NextResponse.json(
                { error: "No tienes permisos para eliminar usuarios" },
                { status: 403 }
            );
        }

        const resolvedParams = await params;
        const targetUserId = parseInt(resolvedParams.id, 10);

        if (isNaN(targetUserId)) {
            return NextResponse.json(
                { error: "Has ingresado un parámetro que no es un número" },
                { status: 400 }
            );
        }

        if (Number(currentUser.id) === targetUserId) {
            return NextResponse.json(
                { error: "No puedes eliminar tu propia cuenta" },
                { status: 400 }
            );
        }

        const targetUserQuery = await pool.query(
            `SELECT id, rol_id, branch_id, auth_user_id, foto_public_id
            FROM usuarios WHERE id = $1`,
            [targetUserId]
        );

        const targetUser = targetUserQuery.rows[0];

        if (!targetUser) {
            return NextResponse.json(
                { error: "No existe un usuario con ese ID" },
                { status: 404 }
            );
        }

        if (Number(targetUser.rol_id) === 1) {
            return NextResponse.json(
                { error: "No es posible eliminar a un usuario con rol de Administrador (rol_id: 1)" },
                { status: 400 }
            );
        }

        if (Number(currentUser.rol_id) === 2) {
            if (Number(targetUser.rol_id) !== 3) {
                return NextResponse.json(
                    { error: "Como gerente (rol 2) solo puedes eliminar a usuarios con rol 3" },
                    { status: 403 }
                );
            }

            if (targetUser.branch_id !== currentUser.branch_id) {
                return NextResponse.json(
                    { error: "Solo puedes eliminar usuarios que pertenezcan a tu misma sucursal" },
                    { status: 403 }
                );
            }
        }

        const response = await pool.query(
            `DELETE FROM usuarios WHERE id = $1 RETURNING id, auth_user_id, name, last_name, email,foto_public_id`,
            [targetUserId]
        );

        const deletedUser = response.rows[0];

        if (deletedUser.foto_public_id) {
            try {
                await cloudinary.uploader.destroy(deletedUser.foto_public_id);
            } catch (cloudinaryError) {
                console.error(
                    "Error al eliminar la imagen de Cloudinary:",
                    cloudinaryError
                );
            }
        }

        if (deletedUser.auth_user_id) {
            const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(
                deletedUser.auth_user_id
            );

            if (deleteAuthError) {
                console.error("Error al eliminar el usuario de Supabase Auth:", deleteAuthError);
            }
        }

        return NextResponse.json(
            { 
                message: "Usuario eliminado con éxito", 
                data: {
                    id: deletedUser.id,
                    name: deletedUser.name,
                    last_name: deletedUser.last_name,
                    email: deletedUser.email
                } 
            },
            { status: 200 }
        );

    } catch (err: unknown) {
        console.error("Error en DELETE /api/usuarios/[id]:", err);

        const pgError = err as { code?: string };

        if (pgError.code === "23503") {
            return NextResponse.json(
                { error: "No se puede eliminar el usuario porque tiene registros vinculados asignados" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Error interno en el servidor al eliminar el usuario" },
            { status: 500 }
        );
    }
}