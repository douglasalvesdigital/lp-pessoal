"use client"

import { motion, type HTMLMotionProps } from "motion/react"

/** Fade + subida suave quando o elemento entra na tela. */
export function Reveal({
  delay = 0,
  y = 20,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
      {...props}
    />
  )
}
