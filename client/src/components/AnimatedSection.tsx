import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

type AnimationDirection = "left" | "right" | "up" | "down" | "fade";

interface AnimatedSectionProps {
  children: ReactNode;
  direction?: AnimationDirection;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

const getVariants = (direction: AnimationDirection): Variants => {
  const distance = 60;
  
  const initial: { opacity: number; x?: number; y?: number } = { opacity: 0 };
  
  switch (direction) {
    case "left":
      initial.x = -distance;
      break;
    case "right":
      initial.x = distance;
      break;
    case "up":
      initial.y = distance;
      break;
    case "down":
      initial.y = -distance;
      break;
    case "fade":
    default:
      break;
  }

  return {
    hidden: initial,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  };
};

export function AnimatedSection({
  children,
  direction = "fade",
  delay = 0,
  duration = 0.6,
  className = "",
  once = true,
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      variants={getVariants(direction)}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
  once = true,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  direction?: AnimationDirection;
  className?: string;
}

export function StaggerItem({
  children,
  direction = "up",
  className = "",
}: StaggerItemProps) {
  return (
    <motion.div
      variants={getVariants(direction)}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
