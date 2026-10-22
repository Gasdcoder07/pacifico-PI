import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: "nfrias0@ucol.mx",
            subject: "Hello World",
            text: "Hello world!",
            html: "<strong>Hello world!</strong>",
        })

        return NextResponse.json(
            { data, error }, 
            { status: 200 }
        );
    } catch(err) {
        return NextResponse.json(
            { error: err }, 
            { status: 500 }
        );
    }
}