import React from "react";
import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

export default function AnimatedStars({ autoPlayOnLoad = false }) {
  const stars = ["✦", "✦", "✦"];
  const controls = stars.map(() => useAnimation());
  const [isAnimating, setIsAnimating] = useState(false);

  const colors = ["#d97b66", "#f6c177", "#b1cbbb"]; // pastel colors

  const playSequence = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    for (let i = 0; i < stars.length; i++) {
      await controls[i].start({
        scale: 1.5,
        color: colors[i],
        transition: { duration: 0.18, ease: "easeOut" },
      });
      await controls[i].start({
        scale: 1,
        color: "#6b4226", // base brown
        transition: { duration: 0.15, ease: "easeInOut" },
      });
    }

    setIsAnimating(false);
  };

  useEffect(() => {
    if (autoPlayOnLoad) {
      playSequence();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlayOnLoad]);

  return (
    <div className="flex gap-2 text-2xl font-bold cursor-default" onMouseEnter={playSequence}>
      {stars.map((star, i) => (
        <motion.span
          key={i}
          animate={controls[i]}
          initial={{ scale: 1, color: "#6b4226" }}
          style={{
            textShadow: "1px 1px 0 #f5e1c0, -1px -1px 0 #f5e1c0",
          }}
        >
          {star}
        </motion.span>
      ))}
    </div>
  );
}
