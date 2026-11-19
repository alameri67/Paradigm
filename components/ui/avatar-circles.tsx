"use client"

/**
 * AvatarCircles, as supplied. Paradigm changes (each marked "Paradigm:"):
 *   1. `size` sets the circle size (the original is fixed at 40px).
 *   2. The "+N" circle is a plain label, not an empty link (href="" reloads the page), and only shows when N > 0.
 *   3. `alts` names each face for screen readers.
 *   4. Big counts are shortened (+1.2k), and the circle widens into a pill when the number needs it.
 */

import React from "react"

import { cn } from "@/lib/utils"

interface AvatarCirclesProps {
  className?: string
  numPeople?: number
  avatarUrls: string[]
  /** Paradigm: circle size in pixels (default 40). */
  size?: number
  /** Paradigm: alt text for each image. */
  alts?: string[]
}

const AvatarCircles = ({
  numPeople,
  className,
  avatarUrls,
  size = 40, // Paradigm
  alts,
}: AvatarCirclesProps) => {
  const box = { width: size, height: size } // Paradigm: was h-10 w-10
  return (
    <div className={cn("z-10 flex rtl:space-x-reverse", className)} style={{ ["--av-overlap" as string]: `${-size * 0.4}px` }}>
      {avatarUrls.map((url, index) => (
        // eslint-disable-next-line @next/next/no-img-element -- as supplied: small external or public portraits
        <img
          key={index}
          className="rounded-full border-2 border-white object-cover dark:border-gray-800 [&:not(:first-child)]:ml-[var(--av-overlap)]"
          style={box}
          src={url}
          width={size}
          height={size}
          alt={alts?.[index] ?? `Avatar ${index + 1}`}
        />
      ))}
      {!!numPeople && numPeople > 0 && ( // Paradigm: a label, not an empty link
        <span
          className="flex items-center justify-center rounded-full border-2 border-white bg-black px-1 text-center font-medium text-white tabular-nums dark:border-gray-800 dark:bg-white dark:text-black [&:not(:first-child)]:ml-[var(--av-overlap)]"
          style={{ height: size, minWidth: size, fontSize: Math.max(9, Math.round(size * 0.32)) }} // Paradigm: a pill when the number is long
        >
          +{numPeople >= 1000 ? `${(numPeople / 1000).toFixed(numPeople >= 10000 ? 0 : 1)}k` : numPeople}
        </span>
      )}
    </div>
  )
}

export { AvatarCircles }
