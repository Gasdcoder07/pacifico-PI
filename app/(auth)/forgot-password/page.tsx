import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import CursorFollower from "@/features/landing/components/CursorFollower";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

const page = async () => {
    const t = await getTranslations("Login")

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <ForgotPasswordForm />
        </div>
    )
}

export default page;