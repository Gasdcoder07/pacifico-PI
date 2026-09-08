import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { nombre, apellido, correo, password, rol_id, branch_id } = body;

        if (!nombre || !apellido || !correo || !password || !rol_id){
            return NextResponse.json(
                { error: 'Faltan campos obligatorios (nombre, apellido, username, correo, password, rol_id)' },
                { status: 400 }
            )
        }

        const { data, error } = await supabase.auth.signUp({
            email: correo.trim().toLowerCase(),
            password,
            options: {
                data: {
                    nombre: nombre,
                    apellido: apellido,
                    rol_id: rol_id,
                    sucursal_id: branch_id 
                    
                }
            }
        })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        return NextResponse.json(
            { message: 'Usuario registrado exitosamente', user: data.user },
            { status: 201 }
        )

    } catch (err) {
        console.error("Ha ocurrido un error, el cual es: ", err)
        return NextResponse.json( { errror: "Error interno del servidor" }, { status: 500 } )
    }
}