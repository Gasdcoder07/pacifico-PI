"use client";

import { useRef, type ReactNode } from "react"
import { gsap, ScrollTrigger, useGSAP } from "../../../shared/lib/gsap"

const FULL_HEIGHT = () => window.innerHeight - 32
const SHRUNK_HEIGHT = () => window.innerHeight / 3

export default function LandingAnimator ({ children } : { children: ReactNode }) {
    const rootRef = useRef<HTMLDivElement>(null)

    useGSAP(
        () => {
            const root = rootRef.current!;
            const get = (name: string) => 
                root.querySelector<HTMLDivElement>(`[data-anim="${name}"]`)!;

            const stage = get("stage")
            const frame = get("frame")
            const imageWrap = get("image-wrap")
            const image = imageWrap.querySelector("img")!
            const overlay = get("overlay")
            const nav = get("nav")
            const navShell = get("nav-shell")
            const title = get("title")
            const titleItems = Array.from(title.children)

            const mm = gsap.matchMedia()

            mm.add(
                {
                    reduce: "(prefers-reduced-motion: reduce)",
                    motion: "(prefers-reduced-motion: no-preference)",
                },
                (ctx) => {
                const { reduce } = ctx.conditions as { reduce: boolean };

                if (reduce) {
                    gsap.set(imageWrap, { clipPath: "inset(0% 0% 0% 0%)" });
                    gsap.set([nav, ...titleItems], { autoAlpha: 1, y: 0 });
                    gsap.set(frame, { height: SHRUNK_HEIGHT });
                    gsap.set(navShell, {
                        backgroundColor: "rgba(10,10,10,0.55)",
                        backdropFilter: "blur(12px)",
                    });
                    return;
                }

                gsap
                    .timeline({ defaults: { ease: "power3.out" } })
                    .fromTo(
                        imageWrap,
                        { clipPath: "inset(0% 0% 100% 0%)" },
                        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.inOut" },
                        0,
                    )
                    .fromTo(image, { scale: 1.12 }, { scale: 1, duration: 1.6, ease: "expo.out" }, 0)
                    .fromTo(nav, { autoAlpha: 0, y: -16 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.75)
                    .fromTo(
                        titleItems,
                        { autoAlpha: 0, y: 24 },
                        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.12 },
                        0.95,
                    );

                // El hero queda fijo mientras se encoge a 1/3 de la pantalla,
                // luego sigue el scroll normal junto al resto de la pagina.
                gsap
                    .timeline({
                        defaults: { ease: "none" },
                        scrollTrigger: {
                            trigger: stage,
                            start: "top top",
                            end: () => `+=${SHRUNK_HEIGHT() * 2}`,
                            scrub: true,
                            pin: stage,
                            pinSpacing: true,
                            anticipatePin: 1,
                            invalidateOnRefresh: true,
                        },
                    })
                    .fromTo(
                        frame,
                        { height: FULL_HEIGHT },
                        { height: SHRUNK_HEIGHT },
                        0,
                    )
                    .to(titleItems, { autoAlpha: 0, y: -24, stagger: 0.05 }, 0)
                    .to(overlay, { opacity: 0.45 }, 0);

                // La barra flotante gana fondo apenas empieza el scroll.
                gsap.fromTo(
                    navShell,
                    { backgroundColor: "rgba(10,10,10,0)", backdropFilter: "blur(0px)" },
                    {
                        backgroundColor: "rgba(10,10,10,0.55)",
                        backdropFilter: "blur(12px)",
                        ease: "none",
                        scrollTrigger: {
                            trigger: stage,
                            start: "top top",
                            end: "+=120",
                            scrub: true,
                        },
                    },
                );
                },
            )
            return () => mm.revert()
        },
        { scope: rootRef }
    )

    return <div ref={rootRef}>{ children }</div>
}
