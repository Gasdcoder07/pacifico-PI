import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import pool from "@/lib/db";

/**
 * @swagger
 * /api/managers:
 *   post:
 *     summary: Crear un nuevo gerente
 *     tags: [Managers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, branch_id, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Carlos Gómez
 *               branch_id:
 *                 type: integer
 *                 example: 10
 *               password:
 *                 type: string
 *                 example: Manager1!
 *     responses:
 *       201:
 *         description: Gerente creado exitosamente.
 *       400:
 *         description: Validación fallida en los datos enviados.
 *       422:
 *         description: Fallo en la inserción del registro.
 *       500:
 *         description: Error interno del servidor.
 */

export async function POST(request: Request) {
    try {
        const { name, branch_id, password } = await request.json()
        
        if (!name || !branch_id || !password) {
            return NextResponse.json(
                { error: "Hacen falta alguno de estos campos (name, branch_id, password)" },
                { status: 400 }
            )
        }
        
        if (isNaN(Number(branch_id))) {
            return NextResponse.json(
                { error: "El id de sucursal no es un número válido" },
                { status: 400 }
            )
        }
        
        const regexExpression = /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/;
        
        if (!regexExpression.test(password)) {
            return NextResponse.json(
                { error: "La contraseña no es segura, asegúrate de cumplir con: 6+ caracteres, al menos una mayúscula, al menos un símbolo." },
                { status: 400 }
            )
        }
        
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds) 
        const queryRegister = `
            INSERT INTO managers(name, branch_id, password, foto_url)
            VALUES ($1, $2, $3, NULL)
            RETURNING name, id, branch_id;
        `

        const response = await pool.query(queryRegister, [name, branch_id, hashedPassword]);

        const nuevoManager = response.rows[0]

        if (!nuevoManager) {
            return NextResponse.json(
                { status: "Hubo un error al intentar crear el gerente" },
                { status: 422 }
            )
        }

        return NextResponse.json(
            { message: "Se ha creado con éxito el nuevo Administrador!", data: nuevoManager },
            { status: 201 }
        )

    } catch (err) {
        return NextResponse.json(
            { error: `Ha ocurrido un error inesperado: ${err}` },
            { status: 500 }
        )
    }

}