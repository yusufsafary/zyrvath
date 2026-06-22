import { useEffect, useRef } from "react";

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    type Star = {
      x: number; y: number; size: number; opacity: number;
      dx: number; dy: number; isBright: boolean; pulseDir: number; layer: number;
    };
    type Meteor = {
      x: number; y: number; len: number; speed: number;
      angle: number; opacity: number; active: boolean; tail: number;
    };

    const starCount = 300;
    const stars: Star[] = Array.from({ length: starCount }).map(() => {
      const isBright = Math.random() > 0.93;
      const layer = Math.floor(Math.random() * 3);
      const speed = (layer + 1) * 0.035;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: isBright ? Math.random() * 2.5 + 1 : Math.random() * 1.1 + 0.2,
        opacity: Math.random() * 0.7 + 0.3,
        dx: (Math.random() - 0.5) * speed * 0.2,
        dy: speed + Math.random() * 0.04,
        isBright,
        pulseDir: Math.random() > 0.5 ? 0.007 : -0.007,
        layer,
      };
    });

    const meteors: Meteor[] = Array.from({ length: 6 }).map(() => ({
      x: Math.random() * canvas.width,
      y: -100,
      len: Math.random() * 140 + 70,
      speed: Math.random() * 9 + 7,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.5,
      opacity: 0,
      active: false,
      tail: Math.random() * 0.5 + 0.3,
    }));

    let lastMeteorTime = Date.now();
    let meteorInterval = 3000 + Math.random() * 5000;

    let animId: number;
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of stars) {
        star.y += star.dy * (dt / 16);
        star.x += star.dx * (dt / 16);
        if (star.y > canvas.height) { star.y = 0; star.x = Math.random() * canvas.width; }
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;

        if (star.isBright) {
          star.opacity += star.pulseDir * (dt / 16);
          if (star.opacity > 1) { star.opacity = 1; star.pulseDir = -Math.abs(star.pulseDir); }
          else if (star.opacity < 0.25) { star.opacity = 0.25; star.pulseDir = Math.abs(star.pulseDir); }

          const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 4);
          glow.addColorStop(0, `rgba(255,210,160,${star.opacity * 0.45})`);
          glow.addColorStop(1, "rgba(255,200,140,0)");
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        ctx.globalAlpha = star.opacity;
        ctx.fillStyle = star.isBright
          ? `rgba(255,230,190,1)`
          : star.layer === 0 ? `rgba(180,195,240,1)` : `rgba(210,220,255,1)`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      const now2 = Date.now();
      if (now2 - lastMeteorTime > meteorInterval) {
        const inactive = meteors.find(m => !m.active);
        if (inactive) {
          inactive.x = Math.random() * canvas.width * 0.75;
          inactive.y = Math.random() * canvas.height * 0.25 - 80;
          inactive.len = Math.random() * 160 + 90;
          inactive.speed = Math.random() * 11 + 8;
          inactive.opacity = 0;
          inactive.active = true;
          inactive.tail = Math.random() * 0.5 + 0.3;
        }
        lastMeteorTime = now2;
        meteorInterval = 2000 + Math.random() * 6000;
      }

      for (const meteor of meteors) {
        if (!meteor.active) continue;
        meteor.x += Math.cos(meteor.angle) * meteor.speed * (dt / 16);
        meteor.y += Math.sin(meteor.angle) * meteor.speed * (dt / 16);

        if (meteor.x < canvas.width * 0.4) {
          meteor.opacity = Math.min(1, meteor.opacity + 0.06 * (dt / 16));
        } else {
          meteor.opacity = Math.max(0, meteor.opacity - 0.05 * (dt / 16));
        }

        if (meteor.x > canvas.width + 100 || meteor.y > canvas.height + 100 || meteor.opacity <= 0) {
          meteor.active = false;
          continue;
        }

        const tailX = meteor.x - Math.cos(meteor.angle) * meteor.len;
        const tailY = meteor.y - Math.sin(meteor.angle) * meteor.len;
        const grad = ctx.createLinearGradient(tailX, tailY, meteor.x, meteor.y);
        grad.addColorStop(0, `rgba(255,140,50,0)`);
        grad.addColorStop(meteor.tail, `rgba(255,190,80,${meteor.opacity * 0.55})`);
        grad.addColorStop(1, `rgba(255,255,220,${meteor.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(meteor.x, meteor.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,230,${meteor.opacity})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse at 12% 22%, rgba(88,28,135,0.5) 0%, transparent 42%),
            radial-gradient(ellipse at 84% 74%, rgba(6,78,133,0.42) 0%, transparent 42%),
            radial-gradient(ellipse at 50% 6%, rgba(79,70,229,0.28) 0%, transparent 36%),
            radial-gradient(ellipse at 72% 88%, rgba(160,40,10,0.18) 0%, transparent 33%),
            radial-gradient(ellipse at 30% 75%, rgba(20,60,100,0.2) 0%, transparent 35%),
            #030712
          `
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 z-10" />
      <div
        className="absolute inset-0 z-20 pointer-events-none opacity-[0.022]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.9) 3px,rgba(255,255,255,0.9) 4px)' }}
      />
    </div>
  );
}
