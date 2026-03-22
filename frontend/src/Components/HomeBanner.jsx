import React, { useEffect, useRef, useState } from "react";
import img1 from "../assets/hero.png";
import { heroStyles as styles } from "../assets/dummyStyles";

export default function HeroSleek() {
  const wrapRef = useRef(null);
  const bgRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    function onMove(e) {
      const r = el.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const x = (clientX - r.left) / r.width;
      const y = (clientY - r.top) / r.height;

      setMouse({ x, y });
      el.style.setProperty("--mx", x);
      el.style.setProperty("--my", y);
    }

    function onLeave() {
      setMouse({ x: 0.5, y: 0.5 });
      el.style.setProperty("--mx", 0.5);
      el.style.setProperty("--my", 0.5);
    }

    el.addEventListener("mousemove", onMove);
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("touchend", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("touchend", onLeave);
    };
  }, []);

  const maxTanslate = 14;
  const tx = (mouse.x - 0.5) * 2 * maxTanslate;
  const ty = (mouse.y - 0.5) * 2 * (maxTanslate * 0.55);

  return (
    <div className="">
      <div
        ref={wrapRef}
        className={styles.container}
        style={{ ["--mx"]: 0.5, ["--my"]: 0.5 }}
      >
        {/* Bacground */}
        <div
          ref={bgRef}
          className={styles.background}
          style={{
            transform: `translate3d(${tx * 0.55}px, ${
              ty * 0.55
            }px, 0) scale(1.03)`,
            transition: "transform 220ms cubic-bezier(.2,.9,.25,1)",
          }}
        >
          <img
            src={img1}
            alt="Futuristic car"
            className="hero-img"
            draggable="false"
          />

          <div className={styles.gradientOverlay}></div>
        </div>

        {/* SVG sweeps  */}
        <svg
          className={styles.svgContainer}
          viewBox="0 0 1590 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="gCentre" x1="0" x2="1">
              <stop offset="0%" stopColor="#8ee6ff" stopOpacity="0" />
              <stop offset="20%" stopColor="#58a6ff" stopOpacity="0.9" />
              <stop offset="80%" stopColor="#b78bff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#b78bff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gSide" x1="0" x2="1">
              <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0" />
              <stop offset="30%" stopColor="#60a5fa" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
            </linearGradient>
            <filter id="glow2" x="-50%" y="-50%" width="200%" height="200%">
              <faGaussianBlur stdDeviation="8" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourcheGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            id="centrePath"
            d="M320 420 C 520 220, 720 170, 880 190 c 1040 210, 110 280 1240 320"
            stroke="url(#gCenter)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            filter="url(#glow2)"
            className="center-path"
          />

          <path
            id="leftArc"
            d="M180 460 C 280 360 , 480 300, 720 260"
            stroke="ur(#gSide)"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
            filter="url(#glow2)"
            className="side-path left"
          />

          <path
            id="rightArc"
            d="M1420 460 C 1240 360, 1040 300, 780 260"
            stroke="url(#gSide)"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
            filter="url(#glow2)"
            className="side-path right"
          />
        </svg>

        {/* Redefine glass CTA card */}

        <div className={styles.ctaContainer}>
          <div className={styles.ctaCard}>
            <div>
              <p className={styles.subtitle}>KARZONE</p>
              <h3 className={styles.title}>Next-gen fleet. Instant drive</h3>
              <p className={styles.description}>
                Rent Your Dream Car. TransParent pricing. Book in seconds.
              </p>
            </div>
            <a href="/cars" className="flex items-center gap-3">
              <button className={styles.ctaButton}>
                <span className={styles.buttonText}>See Fleet</span>
              </button>
            </a>
            <span aria-hidden className={styles.outline}></span>
          </div>
        </div>
      </div>
    </div>
  );
}
