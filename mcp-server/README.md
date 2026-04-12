# Survey Responses MCP Server

A Model Context Protocol (MCP) server that provides read-only access to survey responses stored in a Supabase database.

## Tools

| Tool | Description |
|------|-------------|
| `get_all_responses` | Returns all responses (optional `limit` param, default 100) |
| `get_response_count` | Returns the total number of responses |
| `get_response_by_id` | Get a single response by UUID |
| `get_responses_by_field` | Filter responses by any column value |
| `get_statistics` | Aggregate stats: count, avg score_maitrise, distributions of usage_ia and secteur |

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in this directory (or pass env vars directly):

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### 3. Build

```bash
npm run build
```

### 4. Run (standalone test)

```bash
npm start
```

## Claude Desktop Configuration

Add the following to your Claude Desktop MCP settings (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "survey-responses": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/dist/index.js"],
      "env": {
        "SUPABASE_URL": "https://your-project.supabase.co",
        "SUPABASE_ANON_KEY": "your-anon-key"
      }
    }
  }
}
```

## Transport

This server uses **stdio** transport.
