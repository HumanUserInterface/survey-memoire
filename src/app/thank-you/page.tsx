"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Copy, Heart } from "lucide-react";

export default function ThankYouPage() {
  const [copied, setCopied] = useState(false);

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
      // Fallback for older browsers
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
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6">
      <Card className="w-full max-w-md border-0 shadow-none text-center">
        <CardContent className="space-y-6 pt-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
            <Heart className="h-8 w-8 text-accent" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Merci pour votre participation !</h1>
            <p className="text-muted-foreground">
              Vos réponses ont bien été enregistrées. Elles contribueront à
              la recherche sur l&apos;adoption de l&apos;IA en entreprise.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <p className="text-sm text-muted-foreground">
              Partagez ce questionnaire avec vos collègues :
            </p>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3">
              <span className="flex-1 truncate text-sm">{surveyUrl}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="shrink-0 gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-accent" />
                    Copié
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copier
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
