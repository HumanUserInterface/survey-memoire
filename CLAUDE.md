# CLAUDE.md — Working instructions

## Project context
Data collection app for a Master 2 research thesis (France).
Topic: AI adoption in the workplace, functional illiteracy, psychological barriers.
Stack: Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Supabase, Recharts.

## Design system
- Font: Geist (via `next/font/google` — bundled with Next.js)
- Background: white (#FFFFFF)
- Primary color: #074F57
- Secondary color: #077187
- Accents: #74A57F, #9ECE9A, #E4C5AF
- Use shadcn/ui components as the base UI layer — override with primary/secondary colors via CSS variables in globals.css
- No gradients, no decorative shadows
- Minimal, flat, professional UI

## shadcn/ui usage
- Always prefer shadcn components over raw HTML elements
- Use: Button, Card, CardHeader, CardContent, Progress, Slider, Badge, Select, RadioGroup, Label, Textarea
- Override shadcn's --primary CSS variable in globals.css to match #074F57

## Architecture
- /app/survey → public survey form (one question at a time)
- /app/thank-you → confirmation page
- /app/dashboard → password-protected dashboard
- /components/survey → survey-specific components (QuestionCard, ProgressBar, etc.)
- /components/dashboard → dashboard charts and stat cards
- /components/ui → shadcn auto-generated components (do not edit manually)
- /lib/supabase.ts → Supabase client
- /lib/questions.ts → survey config — single source of truth for all questions and conditional logic

## Development rules
- Strict TypeScript — no `any`
- Always handle loading and error states
- Mobile-first — the survey must be flawless at 375px width
- Supabase credentials live in .env.local — never hardcode them
- All code and comments in English
- All UI text (labels, buttons, questions) in French — it's a French-language survey
