import { getSaleTicket } from "../services/sales.services";

interface TicketMessages {
    title: string;
    subtitle: string;
}

export const openSaleTicket = async (
    saleId: string | number,
    messages: TicketMessages
): Promise<void> => {
    const isDark =
        document.documentElement.classList.contains("dark") ||
        document.documentElement.dataset.theme === "dark";

    const pdfTab = window.open("about:blank", "_blank");

    if (!pdfTab) {
        return;
    }

    pdfTab.opener = null;
    pdfTab.document.title = `Pacifico | Ticket #${saleId}`;

    pdfTab.document.documentElement.classList.toggle("dark", isDark);

    pdfTab.document.body.innerHTML = `
        <div class="container">
            <div class="spinner"></div>
            <h2 id="ticket-title"></h2>
            <p id="ticket-subtitle"></p>
        </div>

        <style>
            :root {
                color-scheme: light;
                --background: #f8fafc;
                --foreground: #0f172a;
                --muted: #64748b;
                --spinner-track: #cffafe;
                --spinner-active: #06b6d4;
            }

            :root.dark {
                color-scheme: dark;
                --background: #020617;
                --foreground: #f8fafc;
                --muted: #94a3b8;
                --spinner-track: #1e293b;
                --spinner-active: #22d3ee;
            }

            body {
                margin: 0;
                background: var(--background);
                color: var(--foreground);
                font-family: system-ui, sans-serif;
            }

            .container {
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 16px;
            }

            .spinner {
                width: 42px;
                height: 42px;
                border: 3px solid var(--spinner-track);
                border-top-color: var(--spinner-active);
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            }

            h2 {
                margin: 0;
                font-size: 20px;
                font-weight: 600;
            }

            p {
                margin: 0;
                color: var(--muted);
                font-size: 14px;
                text-align: center;
            }

            @keyframes spin {
                to {
                transform: rotate(360deg);
                }
            }
        </style>
    `;

    pdfTab.document.getElementById("ticket-title")!.textContent =
        messages.title;

    pdfTab.document.getElementById("ticket-subtitle")!.textContent =
        messages.subtitle;


    try {
        const pdf = await getSaleTicket(saleId);

        if (pdfTab.closed) return;

        const pdfBlob = new Blob([pdf], {
            type: "application/pdf",
        });

        const pdfUrl = URL.createObjectURL(pdfBlob);
        pdfTab.location.replace(pdfUrl);

        setTimeout(() => {
            URL.revokeObjectURL(pdfUrl);
        }, 10 * 60 * 1000);

    } catch (error) {
        pdfTab.close();
        throw error;
    }
};
