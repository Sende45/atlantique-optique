"use client";

import { MotionConfig } from "framer-motion";

// Respecte le réglage "réduire les animations" du téléphone / ordinateur
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}