import React, { useState, useRef } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "motion/react";
import { Link } from "lucide-react";

export const InteractiveGlobe = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion values for the "Link" node
  const x = useMotionValue(250);
  const y = useMotionValue(250);
  
  // High-performance spring configs
  const smoothX = useSpring(x, { damping: 30, stiffness: 200 });
  const smoothY = useSpring(y, { damping: 30, stiffness: 200 });

  const [isActive, setIsActive] = useState(false);

  const centerX = 250;
  const centerY = 250;
  const radius = 200;

  // Image 2 shows specific orbital lines
  // Longitude ellipses (RX values vary, RY is constant radius)
  const longLines = [0, 80, 160];
  // Latitude ellipses (Perspective: RY varies, RX is constant radius)
  const latLines = [0, 60, 120];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const mX = e.clientX - rect.left;
    const mY = e.clientY - rect.top;

    const scale = 500 / rect.width;
    const nX = (mX * scale) - centerX;
    const nY = (mY * scale) - centerY;

    const dist = Math.hypot(nX, nY);

    if (dist < 280) {
      if (!isActive) setIsActive(true);

      // Find closest point on ANY orbit line
      let bestPos = { x: 0, y: 0, dist: Infinity };

      // Longitude Snapping
      longLines.forEach(rx => {
        // Vertical ellipse: (x/rx)^2 + (y/radius)^2 = 1 (if rx > 0)
        // If rx=0, it's a vertical center line
        if (rx === 0) {
          const snappedY = Math.max(-radius, Math.min(radius, nY));
          const d = Math.hypot(nX, nY - snappedY);
          if (d < bestPos.dist) bestPos = { x: 0, y: snappedY, dist: d };
        } else {
          const angle = Math.atan2(nY, nX * (radius / rx));
          const targetX = rx * Math.cos(angle);
          const targetY = radius * Math.sin(angle);
          const d = Math.hypot(nX - targetX, nY - targetY);
          if (d < bestPos.dist) bestPos = { x: targetX, y: targetY, dist: d };
        }
      });

      // Latitude Snapping
      latLines.forEach(ry => {
        // Horizontal ellipse: (x/radius)^2 + (y/ry)^2 = 1
        if (ry === 0) {
          const snappedX = Math.max(-radius, Math.min(radius, nX));
          const d = Math.hypot(nX - snappedX, nY);
          if (d < bestPos.dist) bestPos = { x: snappedX, y: 0, dist: d };
        } else {
          const angle = Math.atan2(nY * (radius / ry), nX);
          const targetX = radius * Math.cos(angle);
          const targetY = ry * Math.sin(angle);
          const d = Math.hypot(nX - targetX, nY - targetY);
          if (d < bestPos.dist) bestPos = { x: targetX, y: targetY, dist: d };
        }
      });

      x.set(bestPos.x + centerX);
      y.set(bestPos.y + centerY);
    } else {
      setIsActive(false);
      x.set(250);
      y.set(250);
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setIsActive(false); x.set(250); y.set(250); }}
      className="relative w-full aspect-square max-w-[500px] flex items-center justify-center p-4 bg-transparent group"
    >
      {/* Background radial glow */}
      <div className={`absolute inset-0 bg-primary/5 rounded-full blur-[100px] transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-40'}`} />

      <svg viewBox="0 0 500 500" className="w-full h-full relative z-10 overflow-visible">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.1" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Outer Circle Ring */}
        <circle cx="250" cy="250" r="200" fill="none" stroke="url(#lineGrad)" strokeWidth="1" />

        {/* Orbital Lines - Longitude */}
        {longLines.map((rx, i) => (
          <ellipse 
            key={`long-${i}`} 
            cx="250" cy="250" rx={rx} ry="200" 
            fill="none" stroke="currentColor" strokeWidth="1" 
            className="text-primary/20"
          />
        ))}

        {/* Orbital Lines - Latitude */}
        {latLines.map((ry, i) => (
          <ellipse 
            key={`lat-${i}`} 
            cx="250" cy="250" rx="200" ry={ry} 
            fill="none" stroke="currentColor" strokeWidth="1" 
            className="text-primary/20"
          />
        ))}

        {/* Intersecting Nodes (Glow dots from Image 2) */}
        <g className="opacity-30">
          {longLines.map(rx => latLines.map(ry => (
            <React.Fragment key={`${rx}-${ry}`}>
              <circle cx={250 + rx} cy={250} r="2" fill="var(--primary)" />
              <circle cx={250 - rx} cy={250} r="2" fill="var(--primary)" />
              <circle cx={250} cy={250 + ry} r="2" fill="var(--primary)" />
              <circle cx={250} cy={250 - ry} r="2" fill="var(--primary)" />
            </React.Fragment>
          )))}
        </g>

        {/* Traveling Data Bits */}
        <DataBit path={`M 250,50 A 0,0 0 1,1 250,50`} rx={160} ry={200} duration={4} delay={0} />
        <DataBit path={`M 250,50 A 0,0 0 1,1 250,50`} rx={200} ry={60} duration={6} delay={2} />
      </svg>

      {/* The Floating Link Node - Positioned over SVG for better interaction */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="z-20 pointer-events-none"
      >
        <div className="relative">
          {/* Animated Rings from Image 2 */}
          <motion.div 
            animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-[-20px] rounded-full border border-primary/40"
          />
          <motion.div 
            animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
            className="absolute inset-[-20px] rounded-full border border-primary/20"
          />

          {/* Main Icon Container */}
          <div className="w-16 h-16 rounded-full bg-background border border-primary shadow-[0_0_30px_rgba(139,0,74,0.3)] flex items-center justify-center relative backdrop-blur-sm">
             <Link className="w-7 h-7 text-primary" strokeWidth={2.5} />
             
             {/* Inner Scanline/Glow */}
             <motion.div 
               animate={{ y: [-30, 30] }}
               transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
               className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent h-4 w-full opacity-50"
             />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const DataBit = ({ rx, ry, duration, delay }: { rx: number; ry: number; duration: number; delay: number }) => {
    return (
        <motion.ellipse
            cx="250" cy="250" rx={rx} ry={ry}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3"
            strokeDasharray="0 400"
            animate={{
                strokeDasharray: ["0 400", "400 400", "400 0"],
                opacity: [0, 1, 0]
            }}
            transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: "easeInOut"
            }}
            className="filter blur-[1px]"
        />
    )
}
