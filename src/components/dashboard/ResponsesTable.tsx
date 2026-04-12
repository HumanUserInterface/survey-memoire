"use client";

import { useState } from "react";
import type { SurveyResponse } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const COLUMNS: { key: keyof SurveyResponse; label: string; width?: string }[] = [
  { key: "created_at", label: "Date", width: "130px" },
  { key: "secteur", label: "Secteur" },
  { key: "taille_entreprise", label: "Taille" },
  { key: "niveau_poste", label: "Poste" },
  { key: "age_tranche", label: "Âge" },
  { key: "usage_ia", label: "Usage IA" },
  { key: "frequence_usage", label: "Fréquence" },
  { key: "connait_llm", label: "LLM" },
  { key: "comprend_erreurs", label: "Erreurs" },
  { key: "qualite_prompts", label: "Prompts" },
  { key: "verifie_reponses", label: "Vérifie" },
  { key: "score_maitrise", label: "Score" },
  { key: "niveau_inquietude", label: "Inquiétude" },
  { key: "nature_inquietudes", label: "Types inquiétudes" },
  { key: "risque_remplacement", label: "Remplacement" },
  { key: "remise_en_question_valeur", label: "Valeur" },
  { key: "nature_resistance", label: "Résistance" },
  { key: "encouragement_entreprise", label: "Encouragement" },
  { key: "formation_proposee", label: "Formation" },
  { key: "apprentissage_modal", label: "Apprentissage" },
  { key: "competences_suffisantes", label: "Compétences" },
  { key: "qualification_approche", label: "Approche" },
  { key: "commentaire_libre", label: "Commentaire" },
  { key: "email", label: "Email" },
];

const PAGE_SIZE = 20;

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return String(value);
}

interface ResponsesTableProps {
  data: SurveyResponse[];
}

export function ResponsesTable({ data }: ResponsesTableProps) {
  const [sortKey, setSortKey] = useState<keyof SurveyResponse>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const sorted = [...data].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal === null) return 1;
    if (bVal === null) return -1;
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    }
    const aStr = String(aVal);
    const bStr = String(bVal);
    return sortDir === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
  });

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSort = (key: keyof SurveyResponse) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {data.length} répondant{data.length > 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {page + 1} / {Math.max(1, totalPages)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto branded-scrollbar">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="sticky left-0 bg-muted/80 backdrop-blur-sm z-10 px-3 py-2.5 text-left font-medium text-muted-foreground w-8">
                  #
                </th>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:text-foreground transition-colors select-none"
                    style={col.width ? { minWidth: col.width } : { minWidth: "100px" }}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {sortKey === col.key && (
                        sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((row, idx) => (
                <>
                  <tr
                    key={row.id}
                    onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                    className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <td className="sticky left-0 bg-background z-10 px-3 py-2 text-muted-foreground">
                      {page * PAGE_SIZE + idx + 1}
                    </td>
                    {COLUMNS.map((col) => (
                      <td key={col.key} className="px-3 py-2 max-w-[200px] truncate">
                        {formatCell(row[col.key])}
                      </td>
                    ))}
                  </tr>
                  {expandedRow === row.id && (
                    <tr key={`${row.id}-expanded`} className="bg-muted/20">
                      <td colSpan={COLUMNS.length + 1} className="px-4 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                          {COLUMNS.map((col) => {
                            const val = row[col.key];
                            if (val === null || val === undefined) return null;
                            return (
                              <div key={col.key}>
                                <span className="text-muted-foreground">{col.label}:</span>{" "}
                                <span className="text-foreground">{formatCell(val)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
