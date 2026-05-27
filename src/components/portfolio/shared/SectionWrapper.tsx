"use client";

/* # Scroll-triggered animation wrapper for portfolio sections */
/* # Each section fades up when it enters the viewport */

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, duration: 0.8, bounce: 0 },
  },
};

export function SectionWrapper({
  children,
  className = "",
  delay = 0,
  id,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}) {
  return (
    <motion.section
      id={id}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* # Stagger container + item variants for lists */
export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, duration: 0.6, bounce: 0 },
  },
};
