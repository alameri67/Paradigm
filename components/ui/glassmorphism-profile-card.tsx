"use client";

import { useState } from "react";
import { motion } from "framer-motion";
// Paradigm: next/image is swapped for a plain <img> below, because the prototype build has no next/image.
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// Paradigm: Clock and Plus are replaced by a scenario icon and a "read" icon.
import { BookOpen, Copy, Hourglass, MessageCircle, Zap } from "lucide-react";

interface ComponentProps {
  name?: string;
  role?: string;
  email?: string;
  avatarSrc?: string;
  statusText?: string;
  statusColor?: string;
  glowText?: string;
  className?: string;
  // Paradigm: real data and actions in place of the demo's clock, email and "Hire Me".
  /** Shown where the live clock was, e.g. "AGI by 2028 · in 2 years". */
  metaText?: string;
  /** The status dot and the glow bar take this colour (a CSS colour) when it's given. */
  accent?: string;
  /** The first button. */
  primaryLabel?: string;
  onPrimary?: () => void;
  /** What the second button copies, and its label. */
  copyText?: string;
  copyLabel?: string;
  /** When given, the second button runs this (with a chat icon) instead of copying. */
  onSecondary?: () => void;
  secondaryLabel?: string;
}

export default function Component({
  name = "Berat Berkay",
  role = "Developer",
  email = "beratberkaygokdemir@gmail.com",
  avatarSrc = "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ2l0aHViL2ltZ18yc2pLdFl5STR0MkZMcUNKaVNMQVJXRmNBSXIifQ",
  statusText = "Available for work",
  statusColor = "bg-lime-500",
  glowText = "Currently High on Creativity",
  className,
  metaText,
  accent,
  primaryLabel = "Hire Me",
  onPrimary,
  copyText,
  copyLabel = "Copy Email",
  onSecondary,
  secondaryLabel,
}: ComponentProps) {
  const [copied, setCopied] = useState(false);

  // Paradigm: the live clock is replaced by `metaText` (the scenario and its timing).

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText ?? email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("relative w-sm max-w-full", className)}
    >
      <Card className={cn(
    "relative z-10 mx-auto w-full max-w-3xl overflow-visible rounded-[20px]",
    "bg-white/70 backdrop-blur-xl",
    "border border-black/10",
    "shadow-lg shadow-black/10 hover:shadow-black/15"
  )}>
        <CardContent className="p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-3 text-sm text-neutral-600">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={cn("inline-block h-2.5 w-2.5 flex-none rounded-full animate-pulse", accent ? undefined : statusColor)}
                style={accent ? { background: accent } : undefined}
              />
              <span className="select-none font-medium text-neutral-800">{statusText}</span>
            </div>
            {metaText && (
              <div className="flex min-w-0 items-center gap-2 opacity-80">
                <Hourglass className="h-4 w-4 flex-none" />
                <span className="truncate tabular-nums">{metaText}</span>
              </div>
            )}
          </div>


          <div className="flex flex-col justify-center items-center gap-5">
            <div className="relative h-52 w-52 shrink-0 overflow-hidden rounded-[20px] ring-2 ring-white/10 bg-neutral-100">
              {/* Paradigm: plain <img> instead of next/image. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarSrc}
                alt={`${name} avatar`}
                className="absolute inset-0 h-full w-full object-cover object-[50%_20%]"
              />
            </div>
            <div className="min-w-0 max-w-full text-center">
              <h3 className="truncate text-xl font-semibold tracking-tight sm:text-3xl">
                {name}
              </h3>
              <p className="mt-0.5 text-sm text-neutral-500">{role}</p>
            </div>
          </div>


          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button
              variant="outline"
              onClick={onPrimary}
              className="h-12 min-w-0 justify-center gap-1.5 rounded-2xl bg-white/50 px-2.5 text-[13px] hover:bg-white"
            >
              <BookOpen className="h-4 w-4 shrink-0" /> {primaryLabel}
            </Button>

            {onSecondary ? (
              <Button
                variant="outline"
                onClick={onSecondary}
                className="h-12 min-w-0 justify-center gap-1.5 rounded-2xl bg-white/50 px-2.5 text-[13px] hover:bg-white"
              >
                <MessageCircle className="h-4 w-4 shrink-0" /> {secondaryLabel}
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleCopy}
                className="h-12 min-w-0 justify-center gap-1.5 rounded-2xl bg-white/50 px-2.5 text-[13px] hover:bg-white"
              >
                <Copy className="h-4 w-4 shrink-0" /> {copied ? "Copied" : copyLabel}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Paradigm: the glow bar sits in the flow under the card (not absolutely below it), so a
          sentence-long line can wrap without spilling out. It takes the mood colour. */}
      <div
        className={cn("pointer-events-none relative z-0 -mt-6 mx-3 rounded-b-[28px] px-5 pt-9 pb-3.5", accent ? undefined : "bg-lime-400/90")}
        style={accent ? { background: accent, boxShadow: `0 30px 60px -18px ${accent}` } : undefined}
      >
        <div className="flex items-start justify-center gap-2 text-center text-sm font-medium leading-5 text-black">
          <Zap className="mt-0.5 h-4 w-4 flex-none" /> <span className="text-balance">{glowText}</span>
        </div>
      </div>
    </motion.div>
  );
}
