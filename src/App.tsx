import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";

import Starfield from "./components/Starfield";
import SpaceObjects from "./components/SpaceObjects";
import { PROJECTS } from "./data/projects";

export default function App() {
  // Ref til glow-overlay (den der følger musen)
  const glowRef = useRef<HTMLDivElement | null>(null);

  // Opdatér CSS-variabler --mx / --my med musens position
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = glowRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="min-h-screen relative bg-slate-950 text-slate-100 overflow-hidden">
      {/* 1) Baggrund / stjerner (nederst) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Starfield />
      </div>

      {/* 2) Planeter/satellit (over stjerner, men bag UI) */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <SpaceObjects />
      </div>

      {/* 3) Cursor-glow overlay (over planeter) */}
      <div
        ref={glowRef}
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(250px circle at var(--mx, -100px) var(--my, -100px), rgba(59,130,246,.12), transparent 20%)",
        }}
      />

      {/* 4) UI (øverst) */}
      <div className="relative z-30">
        {/* Topbar */}
        <header className="sticky top-0 z-40 border-b border-white/5 backdrop-blur bg-slate-950/40">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <a href="#" className="text-lg font-semibold tracking-tight">
              Loep
            </a>
            <nav className="flex items-center gap-5 text-sm text-slate-300">
              <a className="hover:text-white" href="#projects">
                Projects
              </a>
              <a className="hover:text-white" href="#about">
                About
              </a>
              <a className="hover:text-white" href="#contact">
                Contact
              </a>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pt-12 pb-10">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
          >
            Welcome to the <span className="text-blue-400">Loep</span> Universe.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="mt-4 text-lg md:text-xl text-slate-300 max-w-2xl"
          >
            This is a collection of projects that I have developed. It will be
            updated continuously.
          </motion.p>
          <div className="mt-6 flex gap-3">
            <a
              href="https://github.com/yourname"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 hover:bg-white/5 transition"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-500/20 px-4 py-2 hover:bg-blue-500/30 transition"
            >
              See Projects
            </a>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="mx-auto max-w-6xl px-4 pb-24">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Selected Projects</h2>
            <p className="text-sm text-slate-400">Hover for details</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((p, i) => (
              <motion.article
                key={p.slug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5"
              >
                <img
                  src={p.image}
                  alt=""
                  className="w-full aspect-[4/3] object-cover opacity-90 group-hover:opacity-100 transition"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="text-sm text-slate-300 line-clamp-2">{p.blurb}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-1 rounded-full bg-white/10"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <a
                      href={p.live ?? "#"}
                      className="inline-flex items-center gap-1 text-sm rounded-xl bg-white/10 px-3 py-1.5 hover:bg-white/20"
                    >
                      <ExternalLink className="w-4 h-4" /> Demo
                    </a>
                    {p.repo && (
                      <a
                        href={p.repo}
                        className="inline-flex items-center gap-1 text-sm rounded-xl border border-white/10 px-3 py-1.5 hover:bg-white/5"
                        target="_blank"
                      >
                        <Github className="w-4 h-4" /> Code
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* About + Contact */}
        <section id="about" className="mx-auto max-w-6xl px-4 pb-24">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">About</h2>
          <p className="text-slate-300 max-w-3xl">
            My name is Lucas. I'm a 23 year old with a passion for programming &
            development.
          </p>
        </section>

        <footer id="contact" className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-400">
            © {new Date().getFullYear()} Loep —{" "}
            <a
              className="underline hover:text-white"
              href="mailto:Loepbusiness@gmail.com"
            >
              Loepbusiness@gmail.com
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}