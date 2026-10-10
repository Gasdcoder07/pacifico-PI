import pool from "@/shared/lib/db"
import { NextResponse } from "next/server"

export async function POST() {
    try {
        const response = await pool.query(
            `CREATE TABLE IF NOT EXISTS prueba(msj varchar(10));`
        )
        if (response.rows[0]) {
            return NextResponse.json(
                { success: "Haz podido conectarte a la base de datos" },
                { status: 200 }
            )
        }
        return NextResponse.json(
            { error: `error` },
            { status: 400 }
        )
    } catch ( err ) {
        return NextResponse.json(
            { error: `error ${err}` },
            { status: 500 }
        )
    }
}