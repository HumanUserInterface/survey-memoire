#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables."
  );
  process.exit(1);
}

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const server = new McpServer({
  name: "survey-responses",
  version: "1.0.0",
});

// Tool: get_all_responses
server.tool(
  "get_all_responses",
  "Returns all survey responses with an optional limit (default 100)",
  {
    limit: z
      .number()
      .int()
      .positive()
      .max(1000)
      .default(100)
      .describe("Maximum number of responses to return (default 100, max 1000)"),
  },
  async ({ limit }) => {
    const { data, error } = await supabase
      .from("responses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }
);

// Tool: get_response_count
server.tool(
  "get_response_count",
  "Returns the total number of survey responses",
  {},
  async () => {
    const { count, error } = await supabase
      .from("responses")
      .select("*", { count: "exact", head: true });

    if (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ total_count: count }, null, 2),
        },
      ],
    };
  }
);

// Tool: get_response_by_id
server.tool(
  "get_response_by_id",
  "Get a single survey response by its UUID",
  {
    id: z.string().uuid().describe("The UUID of the response"),
  },
  async ({ id }) => {
    const { data, error } = await supabase
      .from("responses")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }
);

// Tool: get_responses_by_field
server.tool(
  "get_responses_by_field",
  "Filter survey responses by any field value (e.g. secteur=digital_tech, usage_ia=oui). Supports optional limit.",
  {
    field: z
      .string()
      .describe(
        "The column name to filter on (e.g. secteur, taille_entreprise, usage_ia)"
      ),
    value: z
      .string()
      .describe("The value to match (e.g. digital_tech, oui, non)"),
    limit: z
      .number()
      .int()
      .positive()
      .max(1000)
      .default(100)
      .describe("Maximum number of responses to return (default 100)"),
  },
  async ({ field, value, limit }) => {
    const allowedFields = [
      "id",
      "created_at",
      "secteur",
      "taille_entreprise",
      "niveau_poste",
      "age_tranche",
      "usage_ia",
      "frequence_usage",
      "connait_llm",
      "comprend_erreurs",
      "qualite_prompts",
      "verifie_reponses",
      "score_maitrise",
      "niveau_inquietude",
      "risque_remplacement",
      "remise_en_question_valeur",
      "nature_resistance",
      "encouragement_entreprise",
      "formation_proposee",
      "apprentissage_modal",
      "competences_suffisantes",
      "qualification_approche",
      "commentaire_libre",
      "consent_recontact",
      "email",
      "rgpd_consent",
    ];

    if (!allowedFields.includes(field)) {
      return {
        content: [
          {
            type: "text",
            text: `Error: Invalid field "${field}". Allowed fields: ${allowedFields.join(", ")}`,
          },
        ],
      };
    }

    const { data, error } = await supabase
      .from("responses")
      .select("*")
      .eq(field, value)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            { count: data.length, field, value, data },
            null,
            2
          ),
        },
      ],
    };
  }
);

// Tool: get_statistics
server.tool(
  "get_statistics",
  "Returns aggregate statistics: total count, average score_maitrise, distribution of usage_ia, and distribution of secteur",
  {},
  async () => {
    // Fetch all responses (relevant columns only)
    const { data, error } = await supabase
      .from("responses")
      .select("score_maitrise, usage_ia, secteur");

    if (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    }

    const totalCount = data.length;

    // Average score_maitrise
    const scores = data
      .map((r) => r.score_maitrise)
      .filter((s): s is number => s !== null && s !== undefined);
    const avgScoreMaitrise =
      scores.length > 0
        ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100
        : null;

    // Distribution of usage_ia
    const usageIaDistribution: Record<string, number> = {};
    for (const r of data) {
      const key = r.usage_ia ?? "null";
      usageIaDistribution[key] = (usageIaDistribution[key] || 0) + 1;
    }

    // Distribution of secteur
    const secteurDistribution: Record<string, number> = {};
    for (const r of data) {
      const key = r.secteur ?? "null";
      secteurDistribution[key] = (secteurDistribution[key] || 0) + 1;
    }

    const statistics = {
      total_count: totalCount,
      average_score_maitrise: avgScoreMaitrise,
      usage_ia_distribution: usageIaDistribution,
      secteur_distribution: secteurDistribution,
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(statistics, null, 2),
        },
      ],
    };
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Survey Responses MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
