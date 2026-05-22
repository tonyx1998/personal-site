"use client";

import { useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

const STRING_HEIGHT = 44;

/**
 * Wraps a card in a "hanging from a string" visual. On mount, the card
 * does a single gentle swing-in from a small tilt, then settles. No drag,
 * no perpetual sway — quiet and out of the way.
 */
export default function SwingingCard({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const rotate = useMotionValue(0);

  useEffect(() => {
    // Alternate left/right tilt for a hint of variety — kept very small
    const initialTilt = (index % 2 === 0 ? -1 : 1) * 2;
    rotate.set(initialTilt);
    const controls = animate(rotate, 0, {
      type: "spring",
      stiffness: 55,
      damping: 14,
      delay: 0.15 + index * 0.06,
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      style={{
        rotate,
        transformOrigin: "top center",
      }}
      className="relative flex flex-col items-center"
    >
      {/* String + anchor knot */}
      <div
        aria-hidden="true"
        className="relative flex justify-center"
        style={{ height: STRING_HEIGHT, width: "100%" }}
      >
        <div className="absolute top-0 w-1.5 h-1.5 -mt-0.5 rounded-full bg-border" />
        <div className="w-px h-full bg-border" />
      </div>
      <div className="w-full">{children}</div>
    </motion.div>
  );
}
