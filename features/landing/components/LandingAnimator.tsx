"use client";

import { useRef, type ReactNode } from "react"
import { gsap, ScrollTrigger, useGSAP } from "../../../shared/lib/gsap"

const FULL_HEIGHT = () => window.innerHeight - 32
const SHRUNK_HEIGHT = () => window.innerHeight / 3
const IMAGE_SHIFT = () => -(FULL_HEIGHT() - SHRUNK_HEIGHT()) / 2

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
            const after = get("after")
            const titleItems = Array.from(title.children)
            const revealSections = Array.from(
                root.querySelectorAll<HTMLElement>("[data-reveal]"),
            )

            ScrollTrigger.config({ ignoreMobileResize: true })

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
                    gsap.set(image, { y: IMAGE_SHIFT });
                    gsap.set(navShell, {
                        backgroundColor: "rgba(21, 113, 149, 0.8)",
                    });
                    return;
                }

                gsap.set(frame, { willChange: "height" });
                gsap.set(image, { willChange: "transform", force3D: true });

                const applyOffset = () =>
                    gsap.set(after, { marginTop: () => -(FULL_HEIGHT() - SHRUNK_HEIGHT()) });

                applyOffset();
                ScrollTrigger.addEventListener("refreshInit", applyOffset);

                gsap.set(titleItems, { autoAlpha: 0, y: 24 });
                gsap.set(nav, { autoAlpha: 0, y: -16 });

                let titleLinked = false;

                function linkTitle() {
                    if (titleLinked) return;
                    titleLinked = true;

                    scrollTl.fromTo(
                        titleItems,
                        { autoAlpha: 1, y: 0 },
                        {
                            autoAlpha: 0,
                            y: -24,
                            duration: 0.45,
                            stagger: 0.05,
                            immediateRender: false,
                        },
                        0,
                    );
                }

                const intro = gsap
                    .timeline({
                        paused: true,
                        onComplete: linkTitle,
                        defaults: { ease: "power3.out" },
                    })
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

                const scrollTl = gsap
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
                            onUpdate: (self) => {
                                if (self.progress > 0 && intro.progress() < 1) {
                                    intro.progress(1);
                                    linkTitle();
                                }
                            },
                        },
                    })
                    .fromTo(
                        frame,
                        { height: FULL_HEIGHT },
                        { height: SHRUNK_HEIGHT },
                        0,
                    )
                    .fromTo(image, { y: 0 }, { y: IMAGE_SHIFT }, 0)
                    .fromTo(overlay, { opacity: 0.2 }, { opacity: 0.45, immediateRender: false }, 0);

                gsap.fromTo(
                    navShell,
                    {
                        backgroundColor: "rgba(21, 113, 149, 0)",
                        borderColor: "rgba(255, 255, 255, 0)",
                        boxShadow: "0 10px 30px rgba(8, 47, 73, 0)",
                        backdropFilter: "blur(0px) saturate(100%)",
                        WebkitBackdropFilter: "blur(0px) saturate(100%)",
                    },
                    {
                        backgroundColor: "rgba(21, 113, 149, 0.55)",
                        borderColor: "rgba(255, 255, 255, 0.25)",
                        boxShadow: "0 10px 30px rgba(8, 47, 73, 0.15)",
                        backdropFilter: "blur(16px) saturate(150%)",
                        WebkitBackdropFilter: "blur(16px) saturate(150%)",
                        ease: "none",
                        immediateRender: false,
                        scrollTrigger: {
                            trigger: stage,
                            start: "top top",
                            end: "+=120",
                            scrub: true,
                        },
                    },
                );

                revealSections.forEach((section) => {
                    const items = Array.from(
                        section.querySelectorAll<HTMLElement>("[data-reveal-item]"),
                    );

                    gsap.from(items.length ? items : [section], {
                        autoAlpha: 0,
                        y: 32,
                        duration: 0.7,
                        ease: "power3.out",
                        stagger: 0.12,
                        scrollTrigger: {
                            trigger: section,
                            start: "top 85%",
                            once: true,
                        },
                    });
                });

                let introStarted = false;

                const startIntro = () => {
                    if (introStarted) return;
                    introStarted = true;
                    fallback.kill();
                    image.removeEventListener("load", startIntro);
                    image.removeEventListener("error", startIntro);

                    if (window.scrollY > 0) {
                        intro.progress(1);
                        linkTitle();
                        return;
                    }

                    intro.play();
                };

                const fallback = gsap.delayedCall(2.5, startIntro);

                if (image.complete && image.naturalWidth > 0) {
                    startIntro();
                } else {
                    image.addEventListener("load", startIntro, { once: true });
                    image.addEventListener("error", startIntro, { once: true });
                }

                return () => {
                    fallback.kill();
                    image.removeEventListener("load", startIntro);
                    image.removeEventListener("error", startIntro);
                    ScrollTrigger.removeEventListener("refreshInit", applyOffset);
                    gsap.set(after, { clearProps: "marginTop" });
                    gsap.set([frame, image], { clearProps: "willChange" });
                };
                },
            )
            return () => mm.revert()
        },
        { scope: rootRef }
    )

    return <div ref={rootRef}>{ children }</div>
}
