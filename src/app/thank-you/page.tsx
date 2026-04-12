"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GradientWave } from "@/components/survey/GradientWave";
import { Check, Copy, Heart } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export default function ThankYouPage() {
  const [copied, setCopied] = useState(false);
  const [locale] = useState<Locale>("fr");
  const tr = t(locale);

  const surveyUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/survey`
      : "/survey";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(surveyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = surveyUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <GradientWave />
      <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md text-center space-y-8">
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={44}
              height={44}
              className="rounded-xl opacity-90"
            />
          </div>

          <div
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl p-8 space-y-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            style={{
              WebkitBackdropFilter: "blur(40px) saturate(180%)",
              backdropFilter: "blur(40px) saturate(180%)",
            }}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
              <Heart className="h-8 w-8 text-primary" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">{tr.thankYouTitle}</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {tr.thankYouText}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <p className="text-xs text-white/40">{tr.shareText}</p>
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                <span className="flex-1 truncate text-sm text-white/60">
                  {surveyUrl}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="shrink-0 gap-2 text-white/50 hover:text-white hover:bg-white/[0.05]"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-primary" />
                      {tr.copied}
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      {tr.copy}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
