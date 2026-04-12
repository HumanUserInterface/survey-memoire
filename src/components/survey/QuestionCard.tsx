"use client";

import { useState, useEffect } from "react";
import type { Question } from "@/lib/questions";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
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

interface QuestionCardProps {
  question: Question;
  value: string | string[] | number | undefined;
  onChange: (value: string | string[] | number) => void;
  locale: Locale;
}

export function QuestionCard({ question, value, onChange, locale }: QuestionCardProps) {
  const tr = t(locale);
  const [sliderValue, setSliderValue] = useState<number>(
    typeof value === "number" ? value : question.min ?? 1
  );

  useEffect(() => {
    if (typeof value === "number") {
      setSliderValue(value);
    }
  }, [value]);

  const getQuestionText = () => tr.questions[question.id] || question.question;
  const getSectionLabel = () => tr.sectionLabels[question.section] || question.sectionLabel;
  const getOptionLabel = (optValue: string) => {
    return tr.options[question.id]?.[optValue] || optValue;
  };
  const getSliderLabel = () => tr.sliderLabels[question.id] || question.placeholder;

  const renderInput = () => {
    switch (question.type) {
      case "select":
        return (
          <Select
            value={typeof value === "string" ? value : ""}
            onValueChange={(v) => { if (v !== null) onChange(v); }}
          >
            <SelectTrigger className="w-full h-12 bg-white/[0.03] border-white/10 hover:border-white/20 transition-colors">
              <SelectValue placeholder={tr.selectPlaceholder} />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a]/95 backdrop-blur-xl border-white/10">
              {question.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="focus:bg-white/10">
                  {getOptionLabel(opt.value)}
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
            className="space-y-2"
          >
            {question.options?.map((opt, idx) => {
              const isSelected = value === opt.value;
              return (
                <div
                  key={opt.value}
                  className={`group flex items-center space-x-3 rounded-xl border p-3.5 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-primary/50 bg-primary/10 shadow-[0_0_20px_rgba(181,168,149,0.1)]"
                      : "border-white/[0.06] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                  onClick={() => onChange(opt.value)}
                >
                  <RadioGroupItem
                    value={opt.value}
                    id={`${question.id}-${opt.value}`}
                    className="border-white/20 data-[state=checked]:border-primary data-[state=checked]:text-primary"
                  />
                  <Label
                    htmlFor={`${question.id}-${opt.value}`}
                    className="flex-1 cursor-pointer font-normal text-[15px]"
                  >
                    {getOptionLabel(opt.value)}
                  </Label>
                  <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {String.fromCharCode(65 + idx)}
                  </span>
                </div>
              );
            })}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {question.options?.map((opt, idx) => {
              const selected = Array.isArray(value) && value.includes(opt.value);
              return (
                <div
                  key={opt.value}
                  className={`flex items-center space-x-3 rounded-xl border p-3.5 transition-all duration-200 cursor-pointer ${
                    selected
                      ? "border-primary/50 bg-primary/10 shadow-[0_0_20px_rgba(181,168,149,0.1)]"
                      : "border-white/[0.06] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
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
                    className={`h-4 w-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                      selected
                        ? "border-primary bg-primary scale-110"
                        : "border-white/20"
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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <Label className="flex-1 cursor-pointer font-normal text-[15px]">
                    {getOptionLabel(opt.value)}
                  </Label>
                </div>
              );
            })}
          </div>
        );

      case "slider": {
        const min = question.min ?? 1;
        const max = question.max ?? 10;
        const label = getSliderLabel();
        return (
          <div className="space-y-8 pt-4">
            {label && (
              <p className="text-sm text-muted-foreground text-center">{label}</p>
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
            <div className="flex justify-between items-end text-sm text-muted-foreground">
              <span>{min}</span>
              <span className="text-4xl font-light text-primary tabular-nums">
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
            placeholder={locale === "en" ? tr.textareaPlaceholder : question.placeholder}
            rows={4}
            className="resize-none bg-white/[0.03] border-white/10 focus:border-primary/50 transition-colors"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <span className="inline-block text-xs font-medium uppercase tracking-wider text-primary/70 mb-3">
          {getSectionLabel()}
        </span>
        <h2 className="text-xl font-medium leading-relaxed sm:text-2xl">
          {getQuestionText()}
        </h2>
        {!question.required && (
          <p className="text-sm text-muted-foreground mt-1">{tr.optional}</p>
        )}
      </div>
      <div>{renderInput()}</div>
    </div>
  );
}
