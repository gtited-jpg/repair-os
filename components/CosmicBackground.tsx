import React, { useEffect, useRef } from 'react';

const CosmicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const stars: {
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
    }[] = [];
    const numStars = 200;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 1.5,
        color: `rgba(165, 180, 252, ${Math.random()})`, // indigo-300
        vx: (Math.random() - 0.5) / 2,
        vy: (Math.random() - 0.5) / 2,
      });
    }

    let animationFrameId: number;
    
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#0a0a1a'; // dc-background
      ctx.fillRect(0, 0, w, h);

      stars.forEach(star => {
        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0 || star.x > w) star.vx = -star.vx;
        if (star.y < 0 || star.y > h) star.vy = -star.vy;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    }
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default CosmicBackground;
