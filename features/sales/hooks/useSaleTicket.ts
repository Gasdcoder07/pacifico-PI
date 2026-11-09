"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import toast from "react-hot-toast";

import { openSaleTicket } from "../utils/openSaleTicket";

export const useSaleTicket = () => {
    const t = useTranslations("SalesPage.voucher");
    const [isLoading, setIsLoading] = useState(false);

    const viewTicket = async (saleId: string | number) => {
        if (isLoading) return;

        setIsLoading(true);

        try {
            await openSaleTicket(saleId, {
                title: t("title"),
                subtitle: t("subtitle"),
            });
        } catch (e) {
            toast.error(t("ticketError"));
        } finally {
            setIsLoading(false);
        }
    }

    return {
        viewTicket,
        isLoading
    }
}