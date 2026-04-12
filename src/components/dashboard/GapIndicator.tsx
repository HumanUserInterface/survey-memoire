"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface GapIndicatorProps {
  title: string;
  leftLabel: string;
  leftValue: number;
  rightLabel: string;
  rightValue: number;
  unit?: string;
}

export function GapIndicator({
  title,
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
  unit = "%",
}: GapIndicatorProps) {
  const gap = Math.abs(leftValue - rightValue);

  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-sm font-medium">{title}</h3>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-primary">
              {leftValue.toFixed(0)}
              {unit}
            </p>
            <p className="text-xs text-muted-foreground">{leftLabel}</p>
          </div>
          <div className="text-center rounded-lg bg-destructive/10 px-3 py-2">
            <p className="text-lg font-semibold text-destructive">
              {gap.toFixed(0)} pts
            </p>
            <p className="text-xs text-muted-foreground">Écart</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-secondary">
              {rightValue.toFixed(0)}
              {unit}
            </p>
            <p className="text-xs text-muted-foreground">{rightLabel}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
