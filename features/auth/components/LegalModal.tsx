"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

const loadPdf = async () => {
    const mod = await import("react-pdf");
    mod.pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
    ).toString();
    return mod;
};

const Document = dynamic(() => loadPdf().then((mod) => mod.Document), { ssr: false });
const Page = dynamic(() => loadPdf().then((mod) => mod.Page), { ssr: false });

type PdfLegalModalProps = {
    src: string
    title: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const LegalModal = ({
        src,
        title,
        open,
        onOpenChange
    } : PdfLegalModalProps) => {
        const reduceMotion = useReducedMotion()

        const spring = { type: "spring", stiffness: 320, damping: 30, mass: 0.8 } as const;

        const [pageWidth, setPageWidth] = useState(0)
        const [numPages, setNumPages] = useState(0)

        useEffect(() => {
            setNumPages(0)
        }, [src])

        const viewerRef = useCallback((node: HTMLDivElement | null) => {
            if (!node) return

            const observer = new ResizeObserver(([entry]) => {
                setPageWidth(entry.contentRect.width)
            })
            observer.observe(node)

            return () => observer.disconnect()
        }, [])

        return (
            <Dialog.Root open={open} onOpenChange={onOpenChange}>
                <AnimatePresence>
                    {open && (
                        <Dialog.Portal forceMount>
                            <Dialog.Overlay asChild forceMount>
                                <motion.div
                                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                                    initial= {{ opacity: 0 }}
                                    animate= {{ opacity: 1 }}
                                    exit= {{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                />
                            </Dialog.Overlay>
                            <Dialog.Content asChild forceMount>
                                <motion.div
                                    className="fixed left-1/2 top-1/2 z-50 flex h-[85vh] w-[92vw] max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl focus:outline-none dark:bg-neutral-900"
                                    style={{ x: "-50%", y: "-50%" }}
                                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: "-46%" }}
                                    animate={{ opacity: 1, scale: 1, y: "-50%" }}
                                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: "-48%" }}
                                    transition={reduceMotion ? { duration: 0.15 } : spring }
                                >
                                    <header className="flex items-center justify-between border-b border-neutral-200 px-5 py-3 dark:border-neutral-800">
                                        <Dialog.Title className="font-semibold">{title}</Dialog.Title>
                                        <Dialog.Description className="sr-only">
                                            Vista previa del documento PDF
                                        </Dialog.Description>

                                        <div className="flex items-center">
                                            <Dialog.Close asChild>
                                            <button type="button" aria-label="Cerrar" className="grid h-8 w-8 place-items-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                                ✕
                                            </button>
                                            </Dialog.Close>
                                        </div>
                                    </header>
                                    <div
                                        ref={viewerRef}
                                        className="flex-1 overflow-y-auto overscroll-contain bg-neutral-100 p-4 [scrollbar-gutter:stable] dark:bg-neutral-800"
                                    >
                                        <Document
                                            file={src}
                                            suspense={false}
                                            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                                            loading={<p className="py-10 text-center text-sm text-neutral-500">Cargando documento…</p>}
                                            error={<p className="py-10 text-center text-sm text-red-500">No se pudo cargar el documento.</p>}
                                            className="flex flex-col items-center gap-4"
                                        >
                                            {pageWidth > 0
                                                ? Array.from({ length: numPages }, (_, index) => (
                                                    <Page
                                                        key={index}
                                                        pageNumber={index + 1}
                                                        width={pageWidth}
                                                        className="overflow-hidden rounded-lg shadow-md"
                                                    />
                                                ))
                                                : null}
                                        </Document>
                                    </div>
                                </motion.div>
                            </Dialog.Content>
                        </Dialog.Portal>
                    )}
                </AnimatePresence>
            </Dialog.Root>
        )
}
