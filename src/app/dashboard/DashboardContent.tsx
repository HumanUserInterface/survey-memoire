"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabase } from "@/lib/supabase";
import type { SurveyResponse } from "@/lib/types";
import { StatCard } from "@/components/dashboard/StatCard";
import { GapIndicator } from "@/components/dashboard/GapIndicator";
import {
  BarChartCard,
  PieChartCard,
  SideBySideBarChart,
} from "@/components/dashboard/Charts";
import { ResponsesTable } from "@/components/dashboard/ResponsesTable";
import { Button } from "@/components/ui/button";
import { Download, Loader2, RefreshCw, BarChart3, Table2 } from "lucide-react";

// Label maps for display
const LLM_LABELS: Record<string, string> = {
  oui_clairement: "Oui, clairement",
  entendu_parler: "Entendu parler",
  non: "Non",
};

const ERREUR_LABELS: Record<string, string> = {
  oui: "Oui",
  pas_vraiment: "Pas vraiment",
  non: "Non",
};

const INQUIETUDE_LABELS: Record<string, string> = {
  oui_beaucoup: "Oui, beaucoup",
  oui_un_peu: "Oui, un peu",
  non_pas_vraiment: "Non, pas vraiment",
  non_pas_du_tout: "Non, pas du tout",
};

const NATURE_INQUIETUDE_LABELS: Record<string, string> = {
  dependance: "Dépendance",
  perte_competences: "Perte de compétences",
  remplacement_poste: "Remplacement",
  valeur_professionnelle: "Valeur pro",
  qualite_outputs: "Qualité outputs",
  confidentialite: "Confidentialité",
  autre: "Autre",
};

const RESISTANCE_LABELS: Record<string, string> = {
  technique: "Technique",
  personnel: "Personnel",
  les_deux: "Les deux",
  pas_de_reticence: "Pas de réticence",
};

const ENCOURAGEMENT_LABELS: Record<string, string> = {
  oui_explicitement: "Oui, explicitement",
  oui_implicitement: "Oui, implicitement",
  non: "Non",
  ne_sais_pas: "Ne sait pas",
};

const FORMATION_LABELS: Record<string, string> = {
  formation_formelle: "Formation formelle",
  ressources_libres: "Ressources libres",
  workshops: "Ateliers/workshops",
  mentoring: "Mentorat",
  rien: "Rien proposé",
};

const APPRENTISSAGE_LABELS: Record<string, string> = {
  seul_essais: "Seul·e, essais-erreurs",
  youtube_tutos: "YouTube / tutos",
  collegue: "Collègue",
  formation_interne: "Formation interne",
  pas_utilise: "N'utilise pas",
};

const COMPETENCES_LABELS: Record<string, string> = {
  oui_tout_a_fait: "Oui, tout à fait",
  plutot_oui: "Plutôt oui",
  plutot_non: "Plutôt non",
  non_pas_du_tout: "Non, pas du tout",
};

function countField(
  data: SurveyResponse[],
  field: keyof SurveyResponse,
  labels: Record<string, string>
) {
  const counts: Record<string, number> = {};
  for (const key of Object.keys(labels)) {
    counts[key] = 0;
  }
  for (const r of data) {
    const val = r[field] as string | null;
    if (val && counts[val] !== undefined) {
      counts[val]++;
    }
  }
  return Object.entries(counts).map(([key, count]) => ({
    name: labels[key] || key,
    value: count,
  }));
}

function countArrayField(
  data: SurveyResponse[],
  field: keyof SurveyResponse,
  labels: Record<string, string>
) {
  const counts: Record<string, number> = {};
  for (const key of Object.keys(labels)) {
    counts[key] = 0;
  }
  for (const r of data) {
    const values = normalizeMultiValue(r[field]);
    for (const val of values) {
      if (counts[val] !== undefined) {
        counts[val]++;
      }
    }
  }
  return Object.entries(counts).map(([key, count]) => ({
    name: labels[key] || key,
    value: count,
  }));
}

// Normalizes a multi-select field into a string[], tolerating legacy storage
// formats: a native text[] array, a JSON-stringified array ('["a","b"]'),
// or a single bare string ('a').
function normalizeMultiValue(raw: SurveyResponse[keyof SurveyResponse]): string[] {
  if (raw == null) return [];
  if (Array.isArray(raw)) return raw as string[];
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed.startsWith("[")) {
      try {
        const parsed: unknown = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.map((v) => String(v));
      } catch {
        // fall through to treating it as a single value
      }
    }
    return trimmed ? [trimmed] : [];
  }
  return [];
}

export function DashboardContent() {
  const [data, setData] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"analyse" | "respondants">("analyse");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: rows, error: fetchError } = await getSupabase()
      .from("responses")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError("Erreur de chargement des données");
      console.error(fetchError);
    } else {
      setData(rows as SurveyResponse[]);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();

    // Realtime subscription
    const sb = getSupabase();
    const channel = sb
      .channel("responses_realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "responses" },
        (payload) => {
          setData((prev) => [payload.new as SurveyResponse, ...prev]);
        }
      )
      .subscribe();

    return () => {
      sb.removeChannel(channel);
    };
  }, [fetchData]);

  // Export functions
  const exportCSV = () => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((h) => {
            const val = row[h as keyof SurveyResponse];
            if (val === null) return "";
            if (Array.isArray(val)) return `"${val.join(";")}"`;
            return `"${String(val).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `survey-responses-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    if (data.length === 0) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `survey-responses-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={fetchData} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Réessayer
        </Button>
      </div>
    );
  }

  // Compute metrics
  const total = data.length;
  const lastDate =
    total > 0
      ? new Date(data[0].created_at).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "—";

  const regularUsers = data.filter(
    (r) => r.usage_ia === "oui_regulierement"
  ).length;
  const regularPct = total > 0 ? ((regularUsers / total) * 100).toFixed(1) : "0";

  const scoreValues = data
    .map((r) => r.score_maitrise)
    .filter((v): v is number => v !== null);
  const avgScore =
    scoreValues.length > 0
      ? (scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length).toFixed(1)
      : "—";

  // H1 metrics
  const iaUsers = data.filter((r) => r.usage_ia !== "non_jamais");
  const frequentUsers = iaUsers.filter(
    (r) =>
      r.frequence_usage === "plusieurs_fois_jour" ||
      r.frequence_usage === "une_fois_jour"
  ).length;
  const frequentPct =
    iaUsers.length > 0 ? (frequentUsers / iaUsers.length) * 100 : 0;
  const llmUnderstanders = iaUsers.filter(
    (r) => r.connait_llm === "oui_clairement"
  ).length;
  const llmPct =
    iaUsers.length > 0 ? (llmUnderstanders / iaUsers.length) * 100 : 0;

  // H2 metrics
  const identityBarriers = data.filter(
    (r) =>
      r.nature_resistance === "personnel" ||
      r.nature_resistance === "les_deux"
  ).length;
  const toolBarriers = data.filter(
    (r) => r.nature_resistance === "technique"
  ).length;
  const identityPct =
    total > 0 ? (identityBarriers / total) * 100 : 0;
  const toolPct = total > 0 ? (toolBarriers / total) * 100 : 0;

  // H3 metrics
  const encouraged = data.filter(
    (r) =>
      r.encouragement_entreprise === "oui_explicitement" ||
      r.encouragement_entreprise === "oui_implicitement"
  ).length;
  const encouragedPct = total > 0 ? (encouraged / total) * 100 : 0;
  const formallyTrained = data.filter(
    (r) => r.formation_proposee === "formation_formelle"
  ).length;
  const trainedPct = total > 0 ? (formallyTrained / total) * 100 : 0;

  // Side-by-side data for H3
  const encouragementCounts: Record<string, number> = {};
  const formationCounts: Record<string, number> = {};
  for (const key of Object.keys(ENCOURAGEMENT_LABELS)) {
    encouragementCounts[key] = data.filter(
      (r) => r.encouragement_entreprise === key
    ).length;
  }
  for (const key of Object.keys(FORMATION_LABELS)) {
    formationCounts[key] = data.filter(
      (r) => r.formation_proposee === key
    ).length;
  }
  // Build side-by-side: match "oui" categories
  const sideBySideData = [
    {
      name: "Oui (explicite/formel)",
      left: encouragementCounts["oui_explicitement"] || 0,
      right: formationCounts["formation_formelle"] || 0,
    },
    {
      name: "Oui (implicite/libre)",
      left: encouragementCounts["oui_implicitement"] || 0,
      right: formationCounts["ressources_libres"] || 0,
    },
    {
      name: "Non / Rien",
      left: encouragementCounts["non"] || 0,
      right: formationCounts["rien"] || 0,
    },
  ];

  return (
    <div className="space-y-8 p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard — Résultats</h1>
          <p className="text-sm text-muted-foreground">
            Analyse en temps réel des réponses au questionnaire
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            disabled={total === 0}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportJSON}
            disabled={total === 0}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        <button
          onClick={() => setTab("analyse")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === "analyse"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          Analyse
        </button>
        <button
          onClick={() => setTab("respondants")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === "respondants"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Table2 className="h-4 w-4" />
          Répondants
        </button>
      </div>

      {/* Global stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Total réponses" value={total} />
        <StatCard title="Dernière réponse" value={lastDate} />
        <StatCard
          title="Utilisateurs réguliers"
          value={`${regularPct}%`}
          subtitle={`${regularUsers} / ${total}`}
        />
        <StatCard
          title="Score maîtrise moyen"
          value={`${avgScore} / 10`}
          subtitle={`${scoreValues.length} répondants`}
        />
      </div>

      {/* Tab: Répondants */}
      {tab === "respondants" && (
        total === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Aucune réponse pour le moment.</p>
          </div>
        ) : (
          <ResponsesTable data={data} />
        )
      )}

      {/* Tab: Analyse */}
      {tab === "analyse" && total === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Aucune réponse pour le moment.</p>
          <p className="text-sm mt-1">
            Les graphiques apparaîtront quand des réponses seront collectées.
          </p>
        </div>
      )}

      {tab === "analyse" && total > 0 && (
        <>
          {/* H1 — Illectronisme fonctionnel */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">
              H1 — Illectronisme fonctionnel
            </h2>
            <GapIndicator
              title="Écart usage régulier vs compréhension LLM"
              leftLabel="Usage quotidien"
              leftValue={frequentPct}
              rightLabel="Comprennent les LLM"
              rightValue={llmPct}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <BarChartCard
                title="Connaissance des LLM (Q7)"
                data={countField(iaUsers, "connait_llm", LLM_LABELS)}
              />
              <BarChartCard
                title="Compréhension des erreurs IA (Q8)"
                data={countField(iaUsers, "comprend_erreurs", ERREUR_LABELS)}
              />
            </div>
          </section>

          {/* H2 — Anxiété existentielle */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">
              H2 — Anxiété existentielle
            </h2>
            <GapIndicator
              title="Freins identitaires vs freins techniques"
              leftLabel="Identité / valeur"
              leftValue={identityPct}
              rightLabel="Outil technique"
              rightValue={toolPct}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <PieChartCard
                title="Niveau d'inquiétude (Q12)"
                data={countField(data, "niveau_inquietude", INQUIETUDE_LABELS)}
              />
              <BarChartCard
                title="Nature des inquiétudes (Q13)"
                data={countArrayField(
                  data,
                  "nature_inquietudes",
                  NATURE_INQUIETUDE_LABELS
                )}
                horizontal
              />
            </div>
            <BarChartCard
              title="Nature de la résistance (Q16)"
              data={countField(data, "nature_resistance", RESISTANCE_LABELS)}
            />
          </section>

          {/* H3 — Accompagnement */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">
              H3 — Accompagnement institutionnel
            </h2>
            <GapIndicator
              title="Écart encouragement vs formation formelle"
              leftLabel="Encouragés"
              leftValue={encouragedPct}
              rightLabel="Formés (formel)"
              rightValue={trainedPct}
            />
            <SideBySideBarChart
              title="Encouragement (Q17) vs Formation (Q18)"
              data={sideBySideData}
              leftLabel="Encouragement"
              rightLabel="Formation"
            />
            <div className="grid gap-4 md:grid-cols-2">
              <BarChartCard
                title="Modalités d'apprentissage (Q19)"
                data={countArrayField(
                  data,
                  "apprentissage_modal",
                  APPRENTISSAGE_LABELS
                )}
                horizontal
              />
              <BarChartCard
                title="Compétences suffisantes (Q20)"
                data={countField(
                  data,
                  "competences_suffisantes",
                  COMPETENCES_LABELS
                )}
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
