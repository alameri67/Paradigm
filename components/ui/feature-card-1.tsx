// components/ui/animated-feature-card.tsx

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming you have a `cn` utility from shadcn

// Define the props for the component
// Paradigm: `title` is left out of the HTML attributes (it's a ReactNode here), so the type checks.
interface AnimatedFeatureCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** The numerical index to display, e.g., "001" */
  index: string;
  /** The tag or category label */
  tag: string;
  /** The main title or description */
  title: React.ReactNode;
  /** The URL for the central image */
  imageSrc: string;
  /** The color variant which determines the gradient and tag color */
  // Paradigm: green and red added so the card can follow the mood scale.
  color: "orange" | "purple" | "blue" | "green" | "red";
}

// Define HSL color values for each variant to work with shadcn's theming
const colorVariants = {
  orange: {
    '--feature-color': 'hsl(35, 91%, 55%)',
    '--feature-color-light': 'hsl(41, 100%, 85%)',
    '--feature-color-dark': 'hsl(24, 98%, 98%)',
  },
  purple: {
    '--feature-color': 'hsl(262, 85%, 60%)',
    '--feature-color-light': 'hsl(261, 100%, 87%)',
    '--feature-color-dark': 'hsl(264, 100%, 98%)',
  },
  blue: {
    '--feature-color': 'hsl(211, 100%, 60%)',
    '--feature-color-light': 'hsl(210, 100%, 83%)',
    '--feature-color-dark': 'hsl(216, 100%, 98%)',
  },
  // Paradigm: green (calm) and red (alarmed, panicked), darker than the others so the tag text reads on its pale chip.
  green: {
    '--feature-color': 'hsl(158, 64%, 30%)',
    '--feature-color-light': 'hsl(158, 70%, 82%)',
    '--feature-color-dark': 'hsl(152, 60%, 96%)',
  },
  red: {
    '--feature-color': 'hsl(4, 70%, 46%)',
    '--feature-color-light': 'hsl(6, 100%, 86%)',
    '--feature-color-dark': 'hsl(4, 100%, 97%)',
  },
};

const AnimatedFeatureCard = React.forwardRef<
  HTMLDivElement,
  AnimatedFeatureCardProps
>(({ className, index, tag, title, imageSrc, color, ...props }, ref) => {
  const cardStyle = colorVariants[color] as React.CSSProperties;

  return (
    <motion.div
      ref={ref}
      style={cardStyle}
      className={cn(
        "relative flex h-[380px] w-full max-w-sm flex-col justify-end overflow-hidden rounded-2xl border bg-card p-6 shadow-sm",
        className
      )}
      whileHover="hover"
      initial="initial"
      variants={{
        initial: { y: 0 },
        // Paradigm: `boxShadow` (motion has no `shadow` property).
        hover: { y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" },
      }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      // Paradigm: cast, because React's drag/animation handlers differ from motion's in type only.
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {/* Background Gradient */}
      <div
        className="absolute inset-0 z-0 opacity-40 dark:opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 30%, var(--feature-color-light) 0%, transparent 70%)`
        }}
      />

      {/* Index Number */}
      <div className="absolute top-6 left-6 font-mono text-lg font-bold text-muted-foreground">
        {index}
      </div>

      {/* Main Image */}
      {/* Paradigm: the person's cutout fills the space above the words (anchored at the bottom, behind the
          text box) instead of a small centred w-40 icon, so the person reads. */}
      <motion.div
        className="absolute inset-x-0 top-12 bottom-24 z-10 flex items-end justify-center"
        variants={{
            initial: { scale: 1, y: 0 },
            hover: { scale: 1.06, y: -8 },
        }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={tag}
          className="h-full w-auto max-w-full object-contain object-bottom"
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-20 rounded-lg border bg-background/80 p-4 backdrop-blur-sm dark:bg-background/60">
        <span
          className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            backgroundColor: 'var(--feature-color-dark)',
            color: 'var(--feature-color)'
          }}
        >
          {tag}
        </span>
        <p className="text-base text-card-foreground">{title}</p>
      </div>
    </motion.div>
  );
});
AnimatedFeatureCard.displayName = "AnimatedFeatureCard";

export { AnimatedFeatureCard };
