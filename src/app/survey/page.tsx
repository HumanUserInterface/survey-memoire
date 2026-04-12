"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getSupabase } from "@/lib/supabase";
import {
  questions,
  getVisibleQuestions,
  questionToColumn,
} from "@/lib/questions";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { ProgressBar } from "@/components/survey/ProgressBar";
import { QuestionCard } from "@/components/survey/QuestionCard";
import { GradientWave } from "@/components/survey/GradientWave";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Send, Loader2, Globe } from "lucide-react";

type AnswerValue = string | string[] | number;

export default function SurveyPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("fr");
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isAnimating, setIsAnimating] = useState(false);

  const tr = t(locale);
  const visibleQuestions = getVisibleQuestions(answers);
  const currentQuestion = visibleQuestions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === visibleQuestions.length - 1;
  const currentValue = currentQuestion ? answers[currentQuestion.id] : undefined;

  const isCurrentValid = useCallback(() => {
    if (!currentQuestion) return false;
    if (!currentQuestion.required) return true;
    if (currentQuestion.type === "checkbox") {
      return Array.isArray(currentValue) && currentValue.length > 0;
    }
    if (currentQuestion.type === "slider") {
      return currentValue !== undefined;
    }
    return currentValue !== undefined && currentValue !== "";
  }, [currentQuestion, currentValue]);

  const handleAnswer = useCallback(
    (value: AnswerValue) => {
      if (!currentQuestion) return;
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    },
    [currentQuestion]
  );

  const animateTo = useCallback(
    (dir: "next" | "prev", callback: () => void) => {
      setDirection(dir);
      setIsAnimating(true);
      setTimeout(() => {
        callback();
        setIsAnimating(false);
      }, 250);
    },
    []
  );

  const goNext = useCallback(() => {
    if (!isCurrentValid() && currentQuestion?.required) return;
    if (isLast) return;
    animateTo("next", () => setCurrentIndex((i) => i + 1));
  }, [isCurrentValid, isLast, currentQuestion, animateTo]);

  const goBack = useCallback(() => {
    if (isFirst) return;
    animateTo("prev", () => setCurrentIndex((i) => i - 1));
  }, [isFirst, animateTo]);

  // Recalculate index if visible questions change
  useEffect(() => {
    if (currentIndex >= visibleQuestions.length) {
      setCurrentIndex(Math.max(0, visibleQuestions.length - 1));
    }
  }, [visibleQuestions.length, currentIndex]);

  // Keyboard navigation: Enter = next, Shift+Enter or Backspace on empty = back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating || isSubmitting) return;

      // Don't intercept Enter in textarea
      if (e.key === "Enter" && !e.shiftKey) {
        const active = document.activeElement;
        if (active?.tagName === "TEXTAREA") return;

        e.preventDefault();
        if (isLast) {
          if (isCurrentValid() || !currentQuestion?.required) {
            handleSubmit();
          }
        } else {
          goNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnimating, isSubmitting, isLast, currentQuestion, goNext]);

  const handleSubmit = async () => {
    if (!isCurrentValid() && currentQuestion?.required) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const row: Record<string, string | string[] | number | null> = {};
      for (const q of questions) {
        const col = questionToColumn[q.id];
        if (!col) continue;
        const val = answers[q.id];
        row[col] = val === undefined ? null : val;
      }

      const { error: insertError } = await getSupabase()
        .from("responses")
        .insert([row]);

      if (insertError) throw insertError;
      router.push("/thank-you");
    } catch (err) {
      console.error("Submit error:", err);
      setError(tr.errorSubmit);
      setIsSubmitting(false);
    }
  };

  if (!currentQuestion) return null;

  const progress = ((currentIndex + 1) / visibleQuestions.length) * 100;

  return (
    <>
      <GradientWave />
      <main className="relative flex flex-1 flex-col items-center justify-start sm:justify-center px-5 py-6 sm:px-6 sm:py-8">
        {/* Language toggle */}
        <button
          onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
          className="fixed top-4 right-4 z-50 flex items-center gap-1.5 rounded-full bg-white/[0.05] backdrop-blur-md border border-white/10 px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white hover:bg-white/[0.08] transition-all"
        >
          <Globe className="h-3.5 w-3.5" />
          {tr.switchLang}
        </button>

        <div className="w-full max-w-lg space-y-5 sm:space-y-8">
          {/* Logo */}
          <div className="flex justify-center pt-2 sm:pt-0">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="opacity-90"
            />
          </div>

          {/* Progress */}
          <ProgressBar
            current={currentIndex + 1}
            total={visibleQuestions.length}
            locale={locale}
          />

          {/* Glass card */}
          <div
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl px-5 py-5 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            style={{
              WebkitBackdropFilter: "blur(40px) saturate(180%)",
              backdropFilter: "blur(40px) saturate(180%)",
            }}
          >
            {/* Animated question */}
            <div
              className={`transition-all duration-300 ease-out ${
                isAnimating
                  ? direction === "next"
                    ? "opacity-0 translate-y-4"
                    : "opacity-0 -translate-y-4"
                  : "opacity-100 translate-y-0"
              }`}
            >
              <QuestionCard
                key={currentQuestion.id}
                question={currentQuestion}
                value={currentValue}
                onChange={handleAnswer}
                locale={locale}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={goBack}
              disabled={isFirst || isAnimating}
              className="gap-2 text-white/50 hover:text-white hover:bg-white/[0.05]"
            >
              <ArrowLeft className="h-4 w-4" />
              {tr.back}
            </Button>

            <div className="flex items-center gap-3">
              {/* Enter hint */}
              {!isLast && isCurrentValid() && (
                <span className="hidden sm:inline text-xs text-white/30">
                  {tr.pressEnter}
                </span>
              )}

              {isLast ? (
                <Button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    (!isCurrentValid() && currentQuestion.required) ||
                    isAnimating
                  }
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {tr.submit}
                </Button>
              ) : (
                <Button
                  onClick={goNext}
                  disabled={
                    (!isCurrentValid() && currentQuestion.required) || isAnimating
                  }
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {tr.next}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Progress bar thin at bottom */}
          <div className="w-full h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary/80 to-secondary/80 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </main>
    </>
  );
}
