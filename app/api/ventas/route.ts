import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {

    } catch (err) {
        return NextResponse.json(
            { error: `Ha ` }
        )
    }
}