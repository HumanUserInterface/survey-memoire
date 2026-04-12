"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import {
  questions,
  getVisibleQuestions,
  questionToColumn,
} from "@/lib/questions";
import { ProgressBar } from "@/components/survey/ProgressBar";
import { QuestionCard } from "@/components/survey/QuestionCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Send, Loader2 } from "lucide-react";

type AnswerValue = string | string[] | number;

export default function SurveyPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isAnimating, setIsAnimating] = useState(false);

  const visibleQuestions = getVisibleQuestions(answers);
  const currentQuestion = visibleQuestions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === visibleQuestions.length - 1;
  const currentValue = currentQuestion
    ? answers[currentQuestion.id]
    : undefined;

  // Validate the current question has an answer
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
      // Let the exit animation run, then switch
      setTimeout(() => {
        callback();
        setIsAnimating(false);
      }, 200);
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

  // Recalculate index if visible questions change (due to conditional logic)
  useEffect(() => {
    if (currentIndex >= visibleQuestions.length) {
      setCurrentIndex(Math.max(0, visibleQuestions.length - 1));
    }
  }, [visibleQuestions.length, currentIndex]);

  const handleSubmit = async () => {
    if (!isCurrentValid() && currentQuestion?.required) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Build the row matching database columns
      const row: Record<string, string | string[] | number | null> = {};
      for (const q of questions) {
        const col = questionToColumn[q.id];
        if (!col) continue;
        const val = answers[q.id];
        if (val === undefined) {
          row[col] = null;
        } else {
          row[col] = val;
        }
      }

      const { error: insertError } = await getSupabase()
        .from("responses")
        .insert([row]);

      if (insertError) {
        throw insertError;
      }

      router.push("/thank-you");
    } catch (err) {
      console.error("Submit error:", err);
      setError(
        "Une erreur est survenue lors de l'envoi. Veuillez réessayer."
      );
      setIsSubmitting(false);
    }
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-lg space-y-8">
        <ProgressBar
          current={currentIndex + 1}
          total={visibleQuestions.length}
        />

        <div
          className={`transition-all duration-200 ease-in-out ${
            isAnimating
              ? direction === "next"
                ? "opacity-0 translate-x-4"
                : "opacity-0 -translate-x-4"
              : "opacity-100 translate-x-0"
          }`}
        >
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            value={currentValue}
            onChange={handleAnswer}
          />
        </div>

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        <div className="flex items-center justify-between pt-4">
          <Button
            variant="ghost"
            onClick={goBack}
            disabled={isFirst || isAnimating}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>

          {isLast ? (
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                (!isCurrentValid() && currentQuestion.required) ||
                isAnimating
              }
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Envoyer
            </Button>
          ) : (
            <Button
              onClick={goNext}
              disabled={
                (!isCurrentValid() && currentQuestion.required) || isAnimating
              }
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              Suivant
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
