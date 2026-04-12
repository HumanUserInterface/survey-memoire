import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Direct JSON-RPC handler for MCP over Streamable HTTP
// This avoids the Node.js http.IncomingMessage requirement of the SDK transport

const VALID_FIELDS = [
  "secteur", "taille_entreprise", "niveau_poste", "age_tranche", "usage_ia",
  "frequence_usage", "connait_llm", "comprend_erreurs", "qualite_prompts",
  "verifie_reponses", "score_maitrise", "niveau_inquietude", "nature_inquietudes",
  "risque_remplacement", "remise_en_question_valeur", "nature_resistance",
  "encouragement_entreprise", "formation_proposee", "apprentissage_modal",
  "competences_suffisantes", "qualification_approche", "commentaire_libre",
  "consent_recontact", "email", "rgpd_consent",
];

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

const TOOLS = [
  {
    name: "get_all_responses",
    description: "Fetch all survey responses with optional limit",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Max responses (default 100, max 1000)", default: 100 },
      },
    },
  },
  {
    name: "get_response_count",
    description: "Get total number of survey responses",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_response_by_id",
    description: "Get a single response by UUID",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", description: "Response UUID" } },
      required: ["id"],
    },
  },
  {
    name: "get_responses_by_field",
    description: "Filter responses by field value",
    inputSchema: {
      type: "object",
      properties: {
        field: { type: "string", description: `Column name: ${VALID_FIELDS.join(", ")}` },
        value: { type: "string", description: "Value to filter for" },
        limit: { type: "number", description: "Max results (default 100)", default: 100 },
      },
      required: ["field", "value"],
    },
  },
  {
    name: "get_statistics",
    description: "Get aggregate stats: total, avg mastery score, distributions by usage, sector, inquiry level, resistance, encouragement",
    inputSchema: { type: "object", properties: {} },
  },
];

async function handleToolCall(name: string, args: Record<string, unknown>) {
  const sb = getSupabase();

  switch (name) {
    case "get_all_responses": {
      const limit = Math.min(Number(args.limit) || 100, 1000);
      const { data, error } = await sb.from("responses").select("*").order("created_at", { ascending: false }).limit(limit);
      if (error) return `Error: ${error.message}`;
      return JSON.stringify(data, null, 2);
    }
    case "get_response_count": {
      const { count, error } = await sb.from("responses").select("*", { count: "exact", head: true });
      if (error) return `Error: ${error.message}`;
      return `Total responses: ${count}`;
    }
    case "get_response_by_id": {
      const { data, error } = await sb.from("responses").select("*").eq("id", args.id as string).single();
      if (error) return `Error: ${error.message}`;
      return JSON.stringify(data, null, 2);
    }
    case "get_responses_by_field": {
      const field = args.field as string;
      if (!VALID_FIELDS.includes(field)) return `Invalid field. Valid: ${VALID_FIELDS.join(", ")}`;
      const limit = Math.min(Number(args.limit) || 100, 1000);
      const { data, error } = await sb.from("responses").select("*").eq(field, args.value as string).order("created_at", { ascending: false }).limit(limit);
      if (error) return `Error: ${error.message}`;
      return `Found ${data.length} responses:\n${JSON.stringify(data, null, 2)}`;
    }
    case "get_statistics": {
      const { data, error } = await sb.from("responses").select("*");
      if (error) return `Error: ${error.message}`;
      const total = data.length;
      const scores = data.map((r) => r.score_maitrise).filter((v): v is number => v !== null);
      const avgScore = scores.length > 0 ? (scores.reduce((a: number, b: number) => a + b, 0) / scores.length).toFixed(2) : "N/A";
      const countBy = (f: string) => {
        const c: Record<string, number> = {};
        for (const r of data) { const v = r[f] as string | null; if (v) c[v] = (c[v] || 0) + 1; }
        return c;
      };
      return JSON.stringify({
        total_responses: total,
        average_score_maitrise: avgScore,
        usage_ia_distribution: countBy("usage_ia"),
        secteur_distribution: countBy("secteur"),
        niveau_inquietude_distribution: countBy("niveau_inquietude"),
        nature_resistance_distribution: countBy("nature_resistance"),
        encouragement_distribution: countBy("encouragement_entreprise"),
      }, null, 2);
    }
    default:
      return `Unknown tool: ${name}`;
  }
}

// JSON-RPC handler implementing MCP protocol
export async function POST(req: NextRequest) {
  const body = await req.json();

  // Handle JSON-RPC
  const { method, id, params } = body;

  let result: unknown;

  switch (method) {
    case "initialize":
      result = {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "survey-responses", version: "1.0.0" },
      };
      break;

    case "notifications/initialized":
      // No response needed for notifications
      return new Response(null, { status: 204 });

    case "tools/list":
      result = { tools: TOOLS };
      break;

    case "tools/call": {
      const toolName = (params as { name: string }).name;
      const toolArgs = (params as { arguments?: Record<string, unknown> }).arguments || {};
      const text = await handleToolCall(toolName, toolArgs);
      result = { content: [{ type: "text", text }] };
      break;
    }

    case "ping":
      result = {};
      break;

    default:
      return Response.json(
        { jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${method}` } },
        { status: 200 }
      );
  }

  return Response.json(
    { jsonrpc: "2.0", id, result },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}

export async function GET() {
  return Response.json({
    name: "survey-responses",
    version: "1.0.0",
    description: "MCP server for reading survey responses — Master 2 thesis on AI adoption",
    tools: TOOLS.map((t) => t.name),
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
