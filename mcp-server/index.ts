import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs";
import path from "path";

// Load verified BARI/DAE agronomic guidelines from existing knowledge base
const guidelinesPath = path.join(process.cwd(), "data", "bari_guidelines.json");
const guidelinesRaw = fs.readFileSync(guidelinesPath, "utf-8");
const guidelinesData = JSON.parse(guidelinesRaw);

const server = new Server(
  {
    name: "krishirakshak-bari-agronomy-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// 1. Expose BARI/DAE Guidelines as an MCP Resource
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: "krishirakshak://bari-guidelines",
      name: "BARI & DAE Verified Crop Disease Protocols",
      mimeType: "application/json",
      description:
        "Complete Bangladesh Agricultural Research Institute (BARI) and DAE treatment protocols across 38 crop disease classes.",
    },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (request.params.uri === "krishirakshak://bari-guidelines") {
    return {
      contents: [
        {
          uri: request.params.uri,
          mimeType: "application/json",
          text: guidelinesRaw,
        },
      ],
    };
  }
  throw new Error(`Unknown resource: ${request.params.uri}`);
});

// 2. Expose Agronomy Lookup & Dosage Calculator as MCP Tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_crop_disease_protocol",
      description:
        "Retrieve verified BARI/DAE organic and chemical treatment protocols for a specific crop disease class.",
      inputSchema: {
        type: "object",
        properties: {
          diseaseClass: {
            type: "string",
            description: "Crop disease identifier or keyword (e.g., Potato___Late_blight, Tomato, Rice)",
          },
        },
        required: ["diseaseClass"],
      },
    },
    {
      name: "calculate_spray_dosage",
      description:
        "Calculate precision pesticide/fungicide dosage and water volume based on land area in decimals (শতাংশ).",
      inputSchema: {
        type: "object",
        properties: {
          landAreaDecimal: {
            type: "number",
            description: "Land area in decimals (শতাংশ), e.g., 33 for 1 bigha",
          },
          dosePerLiterGrams: {
            type: "number",
            description: "BARI-approved chemical dose in grams/ml per liter of water (default: 2)",
          },
        },
        required: ["landAreaDecimal"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "get_crop_disease_protocol") {
    const query = String(args?.diseaseClass || "").toLowerCase();
    const entries = Array.isArray(guidelinesData)
      ? guidelinesData
      : Object.entries(guidelinesData).map(([key, val]) => ({ id: key, ...(val as object) }));

    const matches = entries.filter((item: Record<string, unknown>) =>
      JSON.stringify(item).toLowerCase().includes(query)
    );

    return {
      content: [
        {
          type: "text",
          text:
            matches.length > 0
              ? JSON.stringify(matches.slice(0, 3), null, 2)
              : `No exact BARI protocol found for "${args?.diseaseClass}". Consult nearest DAE Upazila Agriculture Office.`,
        },
      ],
    };
  }

  if (name === "calculate_spray_dosage") {
    const decimals = Number(args?.landAreaDecimal || 1);
    const dosePerLiter = Number(args?.dosePerLiterGrams || 2);
    // Standard BARI spray volume: ~2 liters of water per decimal (শতাংশ)
    const totalWaterLiters = Number((decimals * 2).toFixed(2));
    const totalChemicalGrams = Number((totalWaterLiters * dosePerLiter).toFixed(2));
    const sprayTanks16L = Number((totalWaterLiters / 16).toFixed(2));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              landAreaDecimal: decimals,
              totalWaterLiters,
              totalChemicalGramsOrMl: totalChemicalGrams,
              standard16LTanksRequired: sprayTanks16L,
              safetyNote: "Follow BARI pre-harvest interval (PHI) and wear protective gear.",
            },
            null,
            2
          ),
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("KrishiRakshak BARI Agronomy MCP Server running on stdio");
}

main().catch((err) => {
  console.error("MCP Server fatal error:", err);
  process.exit(1);
});