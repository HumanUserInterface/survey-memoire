"use client";

import { useState, useEffect } from "react";
import type { Question } from "@/lib/questions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface QuestionCardProps {
  question: Question;
  value: string | string[] | number | undefined;
  onChange: (value: string | string[] | number) => void;
}

export function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  const [sliderValue, setSliderValue] = useState<number>(
    typeof value === "number" ? value : question.min ?? 1
  );

  // Sync slider value when the prop changes (e.g. navigating back)
  useEffect(() => {
    if (typeof value === "number") {
      setSliderValue(value);
    }
  }, [value]);

  const renderInput = () => {
    switch (question.type) {
      case "select":
        return (
          <Select
            value={typeof value === "string" ? value : ""}
            onValueChange={(v) => { if (v !== null) onChange(v); }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez une option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "radio":
        return (
          <RadioGroup
            value={typeof value === "string" ? value : ""}
            onValueChange={(v) => onChange(v)}
            className="space-y-3"
          >
            {question.options?.map((opt) => (
              <div
                key={opt.value}
                className="flex items-center space-x-3 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onChange(opt.value)}
              >
                <RadioGroupItem value={opt.value} id={`${question.id}-${opt.value}`} />
                <Label
                  htmlFor={`${question.id}-${opt.value}`}
                  className="flex-1 cursor-pointer font-normal"
                >
                  {opt.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <div className="space-y-3">
            {question.options?.map((opt) => {
              const selected = Array.isArray(value) && value.includes(opt.value);
              return (
                <div
                  key={opt.value}
                  className={`flex items-center space-x-3 rounded-lg border p-3 transition-colors cursor-pointer ${
                    selected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                  onClick={() => {
                    const current = Array.isArray(value) ? value : [];
                    if (selected) {
                      onChange(current.filter((v) => v !== opt.value));
                    } else {
                      onChange([...current, opt.value]);
                    }
                  }}
                >
                  <div
                    className={`h-4 w-4 rounded border-2 flex items-center justify-center transition-colors ${
                      selected
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {selected && (
                      <svg
                        className="h-3 w-3 text-primary-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <Label className="flex-1 cursor-pointer font-normal">
                    {opt.label}
                  </Label>
                </div>
              );
            })}
          </div>
        );

      case "slider": {
        const min = question.min ?? 1;
        const max = question.max ?? 10;
        return (
          <div className="space-y-6 pt-2">
            {question.placeholder && (
              <p className="text-sm text-muted-foreground text-center">
                {question.placeholder}
              </p>
            )}
            <div className="px-2">
              <Slider
                value={[sliderValue]}
                onValueChange={(v) => {
                  const val = Array.isArray(v) ? v[0] : v;
                  setSliderValue(val);
                  onChange(val);
                }}
                min={min}
                max={max}
                step={question.step ?? 1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{min}</span>
              <span className="text-2xl font-semibold text-primary">
                {sliderValue}
              </span>
              <span>{max}</span>
            </div>
          </div>
        );
      }

      case "textarea":
        return (
          <Textarea
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            rows={4}
            className="resize-none"
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <Badge
          variant="secondary"
          className="w-fit mb-4 bg-secondary/10 text-secondary hover:bg-secondary/10"
        >
          {question.sectionLabel}
        </Badge>
        <h2 className="text-lg font-medium leading-relaxed sm:text-xl">
          {question.question}
        </h2>
        {!question.required && (
          <p className="text-sm text-muted-foreground">Facultatif</p>
        )}
      </CardHeader>
      <CardContent className="px-0">{renderInput()}</CardContent>
    </Card>
  );
}
