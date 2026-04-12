"use client";

import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

interface ProgressBarProps {
  current: number;
  total: number;
  locale: Locale;
}

export function ProgressBar({ current, total, locale }: ProgressBarProps) {
  const tr = t(locale);
  const percentage = Math.round((current / total) * 100);
  const label = tr.questionOf
    .replace("{current}", String(current))
    .replace("{total}", String(total));

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-xs text-white/40">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
    </div>
  );
}
