import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const VALID_FIELDS = [
  "secteur", "taille_entreprise", "niveau_poste", "age_tranche", "usage_ia",
  "frequence_usage", "connait_llm", "comprend_erreurs", "qualite_prompts",
  "verifie_reponses", "score_maitrise", "niveau_inquietude", "nature_inquietudes",
  "risque_remplacement", "remise_en_question_valeur", "nature_resistance",
  "encouragement_entreprise", "formation_proposee", "apprentissage_modal",
  "competences_suffisantes", "qualification_approche", "commentaire_libre",
  "consent_recontact", "email", "rgpd_consent",
] as const;

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase credentials");
  return createClient(url, key);
}

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "survey-responses",
    version: "1.0.0",
  });

  // Tool: get all responses
  server.tool(
    "get_all_responses",
    "Fetch all survey responses with optional limit",
    { limit: z.number().min(1).max(1000).default(100).describe("Max number of responses to return") },
    async ({ limit }) => {
      const sb = getSupabaseClient();
      const { data, error } = await sb
        .from("responses")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
      return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
    }
  );

  // Tool: get response count
  server.tool(
    "get_response_count",
    "Get the total number of survey responses",
    {},
    async () => {
      const sb = getSupabaseClient();
      const { count, error } = await sb
        .from("responses")
        .select("*", { count: "exact", head: true });
      if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
      return { content: [{ type: "text" as const, text: `Total responses: ${count}` }] };
    }
  );

  // Tool: get response by ID
  server.tool(
    "get_response_by_id",
    "Get a single survey response by its UUID",
    { id: z.string().uuid().describe("The UUID of the response") },
    async ({ id }) => {
      const sb = getSupabaseClient();
      const { data, error } = await sb
        .from("responses")
        .select("*")
        .eq("id", id)
        .single();
      if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
      return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
    }
  );

  // Tool: filter responses by field
  server.tool(
    "get_responses_by_field",
    "Filter survey responses by a specific field value. Valid fields: secteur, taille_entreprise, niveau_poste, age_tranche, usage_ia, frequence_usage, connait_llm, comprend_erreurs, qualite_prompts, verifie_reponses, niveau_inquietude, risque_remplacement, nature_resistance, encouragement_entreprise, formation_proposee, competences_suffisantes, qualification_approche",
    {
      field: z.string().describe("Column name to filter on"),
      value: z.string().describe("Value to filter for"),
      limit: z.number().min(1).max(1000).default(100).describe("Max results"),
    },
    async ({ field, value, limit }) => {
      if (!VALID_FIELDS.includes(field as typeof VALID_FIELDS[number])) {
        return { content: [{ type: "text" as const, text: `Invalid field: ${field}. Valid fields: ${VALID_FIELDS.join(", ")}` }] };
      }
      const sb = getSupabaseClient();
      const { data, error } = await sb
        .from("responses")
        .select("*")
        .eq(field, value)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
      return { content: [{ type: "text" as const, text: `Found ${data.length} responses:\n${JSON.stringify(data, null, 2)}` }] };
    }
  );

  // Tool: get statistics
  server.tool(
    "get_statistics",
    "Get aggregate statistics: total count, average mastery score, usage_ia distribution, secteur distribution, inquiry level distribution",
    {},
    async () => {
      const sb = getSupabaseClient();
      const { data, error } = await sb
        .from("responses")
        .select("*");
      if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };

      const total = data.length;
      const scores = data.map((r) => r.score_maitrise).filter((v): v is number => v !== null);
      const avgScore = scores.length > 0 ? (scores.reduce((a: number, b: number) => a + b, 0) / scores.length).toFixed(2) : "N/A";

      const countBy = (field: string) => {
        const counts: Record<string, number> = {};
        for (const r of data) {
          const val = r[field] as string | null;
          if (val) counts[val] = (counts[val] || 0) + 1;
        }
        return counts;
      };

      const stats = {
        total_responses: total,
        average_score_maitrise: avgScore,
        usage_ia_distribution: countBy("usage_ia"),
        secteur_distribution: countBy("secteur"),
        niveau_inquietude_distribution: countBy("niveau_inquietude"),
        nature_resistance_distribution: countBy("nature_resistance"),
        encouragement_distribution: countBy("encouragement_entreprise"),
      };

      return { content: [{ type: "text" as const, text: JSON.stringify(stats, null, 2) }] };
    }
  );

  return server;
}
