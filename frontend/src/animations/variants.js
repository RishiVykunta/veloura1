// Framer Motion Animation Variants for Veloura Design System

export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

export const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: "tween", duration: 0.4, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: { type: "tween", duration: 0.3 }
  }
};

export const drawerVariants = {
  closed: { x: "-100%", transition: { type: "tween", duration: 0.3 } },
  open: { x: 0, transition: { type: "tween", duration: 0.3, ease: "easeOut" } }
};

export const scaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};
