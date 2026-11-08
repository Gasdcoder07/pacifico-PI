import { getTranslations } from "next-intl/server";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

const page = async () => {
    const t = await getTranslations("ResetPassword")

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <ResetPasswordForm />
        </div>
    )
}

export default page;