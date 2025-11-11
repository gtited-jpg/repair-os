import React, { useRef, useEffect } from 'react';

const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    const stars: { x: number; y: number; z: number }[] = [];
    const numStars = 1000;
    const speed = 1;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width - width / 2, // Centered
        y: Math.random() * height - height / 2, // Centered
        z: Math.random() * width,
      });
    }

    let animationFrameId: number;
    const draw = () => {
      if (!ctx) return;
      ctx.fillStyle = '#0a0a1a'; // Matches dc-background
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2, height / 2);

      for (let i = 0; i < numStars; i++) {
        const star = stars[i];
        star.z -= speed;

        if (star.z <= 0) {
          star.z = width;
          star.x = Math.random() * width - width / 2;
          star.y = Math.random() * height - height / 2;
        }

        const k = 128 / star.z;
        const px = star.x * k;
        const py = star.y * k;

        const size = (1 - star.z / width) * 2.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${1 - star.z / width})`;
        ctx.fillRect(px, py, size, size);
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default Starfield;