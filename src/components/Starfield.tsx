import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; a: number; av: number };
type Meteor = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number };

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const meteorsRef = useRef<Meteor[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = (canvas.width = Math.max(1, rect.width) * devicePixelRatio);
      const h = (canvas.height = Math.max(1, rect.height) * devicePixelRatio);

      // Stars
      const count = Math.floor((w * h) / (11000 * devicePixelRatio));
      starsRef.current = Array.from({ length: count }).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * (1.6 * devicePixelRatio) + 0.4,
        a: Math.random() * Math.PI * 2,
        av: (Math.random() * 0.03 + 0.01) * (Math.random() < 0.5 ? -1 : 1),
      }));
    };

const spawnMeteor = (w: number, h: number) => {
  const margin = 80;                   // spawn lidt udenfor kanten
  const dir = Math.random() < 0.5 ? "SE" : "SW"; // SE = ned-højre, SW = ned-venstre

  let x: number, y: number, baseAngle: number;

  if (dir === "SE") {
    // ned mod højre (≈45°)
    baseAngle = Math.PI / 4;
    if (Math.random() < 0.75) {
      // fra TOP
      x = Math.random() * w;
      y = -margin;
    } else {
      // fra VENSTRE
      x = -margin;
      y = Math.random() * h * 0.8; // undgå bunden lidt
    }
  } else {
    // ned mod venstre (≈135°)
    baseAngle = (3 * Math.PI) / 4;
    if (Math.random() < 0.75) {
      // fra TOP
      x = Math.random() * w;
      y = -margin;
    } else {
      // fra HØJRE
      x = w + margin;
      y = Math.random() * h * 0.8;
    }
  }

  // lille variation i retning for at undgå “laser-linjer”
  const angle = baseAngle + (Math.random() * 0.5 - 0.25); // ± ~14°
  const speed = 6 * devicePixelRatio;                    // glat bevægelse
  const maxLife = 120 + Math.random() * 90;                // længere synlighed

  meteorsRef.current.push({
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: 0,
    maxLife,
  });
};



    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;

      // nebula background
      const g = ctx.createRadialGradient(
        w * 0.7, h * 0.3, 0,
        w * 0.7, h * 0.3, Math.max(w, h) * 0.8
      );
      g.addColorStop(0, "rgba(96,132,252,0.15)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // stars
      ctx.save();
      for (const s of starsRef.current) {
        s.a += s.av;
        const alpha = 0.55 + Math.sin(s.a) * 0.45;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
      }
      ctx.restore();

      // meteors: spawn every ~6–12s
      const now = performance.now();
      if (now - lastSpawnRef.current > 6000 + Math.random() * 12000) {
        spawnMeteor(w, h);
        lastSpawnRef.current = now;
      }

      // draw meteors (synlig trail med fast længde + additive blend)
ctx.save();
ctx.globalCompositeOperation = "lighter"; // lys additiver på mørk baggrund

for (let i = meteorsRef.current.length - 1; i >= 0; i--) {
  const m = meteorsRef.current[i];

  // opdater position/liv
  m.x += m.vx;
  m.y += m.vy;
  m.life++;
  const t = m.life / m.maxLife;
  if (t >= 1) { meteorsRef.current.splice(i, 1); continue; }

  // fast halelængde uafhængigt af fart
  const speed = Math.hypot(m.vx, m.vy) || 1;
  const tailLen = 140 * devicePixelRatio; // øg/sænk for længere/kortere hale
  const tx = m.x - (m.vx / speed) * tailLen;
  const ty = m.y - (m.vy / speed) * tailLen;

  // lysstyrke falder over livet
  const headAlpha = 0.75 * (1 - t);  // hovedets intensitet
  const trailAlpha = 0.45 * (1 - t); // halens intensitet

  // trail gradient fra hoved -> hale
  const grad = ctx.createLinearGradient(m.x, m.y, tx, ty);
  grad.addColorStop(0, `rgba(255,255,255,${trailAlpha})`);
  grad.addColorStop(1, `rgba(255,255,255,0)`);

  // trail-streg
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2.2 * devicePixelRatio; // lidt tykkere så den ses
  ctx.beginPath();
  ctx.moveTo(m.x, m.y);
  ctx.lineTo(tx, ty);
  ctx.stroke();

  // hoved (kerne + glow)
  ctx.fillStyle = `rgba(255,255,255,${Math.min(1, headAlpha + 0.15)})`;
  ctx.shadowColor = "rgba(255,255,255,0.6)";
  ctx.shadowBlur = 8 * devicePixelRatio;
  ctx.beginPath();
  ctx.arc(m.x, m.y, 2.2 * devicePixelRatio, 0, Math.PI * 2);
  ctx.fill();

  // nulstil shadow for næste element
  ctx.shadowBlur = 0;
}
ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    draw();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
