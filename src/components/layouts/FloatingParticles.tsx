import * as React from "react";
import { motion } from "framer-motion";

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
};

export function FloatingParticles() {
  const [particles, setParticles] = React.useState<Particle[]>([]);

  React.useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 15 + 15,
      delay: Math.random() * 5,
    }));
    
    setParticles(newParticles);
  }, []);

  const particleClass = "absolute rounded-full bg-cyan-400";
  const containerClass = "absolute inset-0 overflow-hidden pointer-events-none";

  return (
    <div className={containerClass}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={particleClass}
          style={{ width: p.size, height: p.size }}
          initial={{ 
            opacity: 0, 
            x: p.x, 
            y: p.y 
          }}
          animate={{ 
            opacity: [0, 0.5, 0.8, 0.5, 0],
            y: [p.y, p.y - 100, p.y - 200],
            x: [p.x, p.x + 30, p.x - 30],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.2, 0.5, 0.8, 1]
          }}
        />
      ))}
    </div>
  );
}