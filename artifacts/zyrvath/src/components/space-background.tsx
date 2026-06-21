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
      x: number;
      y: number;
      size: number;
      opacity: number;
      dy: number;
      isBright: boolean;
      pulseDirection: number;
    };

    const stars: Star[] = Array.from({ length: 200 }).map(() => {
      const isBright = Math.random() > 0.96;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: isBright ? Math.random() * 2 + 1 : Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        dy: Math.random() * 0.25 + 0.05,
        isBright,
        pulseDirection: Math.random() > 0.5 ? 0.01 : -0.01,
      };
    });

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of stars) {
        star.y += star.dy;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }

        if (star.isBright) {
          star.opacity += star.pulseDirection;
          if (star.opacity > 1) {
            star.opacity = 1;
            star.pulseDirection = -0.01;
          } else if (star.opacity < 0.4) {
            star.opacity = 0.4;
            star.pulseDirection = 0.01;
          }
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(88,28,135,0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(6,78,133,0.35) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 10%, rgba(79,70,229,0.2) 0%, transparent 40%),
            #030712
          `
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10"
      />
    </div>
  );
}
