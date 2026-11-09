import { getSaleTicket } from "../services/sales.services";

export const downloadSaleTicket = async (
    saleId: string | number,
): Promise<void> => {
    const pdf = await getSaleTicket(saleId);

    const pdfBlob = new Blob([pdf], {
        type: "application/pdf",
    });

    const pdfUrl = URL.createObjectURL(pdfBlob);

    const link = document.createElement("a");

    link.href = pdfUrl;
    link.download = `Pacifico-Ticket-Venta-${saleId}.pdf`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
    }, 30_000);
};
