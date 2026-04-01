#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { TochkaBankClient } from "./client.js";
import {
  listAccountsTool,
  getAccountBalanceTool,
  getStatementTool,
} from "./tools/accounts.js";
import {
  createPaymentTool,
  getPaymentStatusTool,
} from "./tools/payments.js";
import {
  listCounterpartiesTool,
  createCounterpartyTool,
  getCompanyInfoTool,
} from "./tools/references.js";

const clientId = process.env.TOCHKA_CLIENT_ID;
const clientSecret = process.env.TOCHKA_CLIENT_SECRET;
const baseUrl =
  process.env.TOCHKA_BASE_URL || "https://enter.tochka.com/api/v2";

if (!clientId || !clientSecret) {
  console.error(
    "Missing TOCHKA_CLIENT_ID or TOCHKA_CLIENT_SECRET environment variables"
  );
  process.exit(1);
}

const client = new TochkaBankClient({ clientId, clientSecret, baseUrl });

const server = new McpServer({
  name: "tochka-bank-mcp",
  version: "1.0.0",
});

server.tool(
  listAccountsTool.name,
  listAccountsTool.description,
  listAccountsTool.inputSchema.shape,
  async () => listAccountsTool.handler(client)
);

server.tool(
  getAccountBalanceTool.name,
  getAccountBalanceTool.description,
  getAccountBalanceTool.inputSchema.shape,
  async (args) => getAccountBalanceTool.handler(client, args)
);

server.tool(
  getStatementTool.name,
  getStatementTool.description,
  getStatementTool.inputSchema.shape,
  async (args) => getStatementTool.handler(client, args)
);

server.tool(
  createPaymentTool.name,
  createPaymentTool.description,
  createPaymentTool.inputSchema.shape,
  async (args) => createPaymentTool.handler(client, args)
);

server.tool(
  getPaymentStatusTool.name,
  getPaymentStatusTool.description,
  getPaymentStatusTool.inputSchema.shape,
  async (args) => getPaymentStatusTool.handler(client, args)
);

server.tool(
  listCounterpartiesTool.name,
  listCounterpartiesTool.description,
  listCounterpartiesTool.inputSchema.shape,
  async () => listCounterpartiesTool.handler(client)
);

server.tool(
  createCounterpartyTool.name,
  createCounterpartyTool.description,
  createCounterpartyTool.inputSchema.shape,
  async (args) => createCounterpartyTool.handler(client, args)
);

server.tool(
  getCompanyInfoTool.name,
  getCompanyInfoTool.description,
  getCompanyInfoTool.inputSchema.shape,
  async () => getCompanyInfoTool.handler(client)
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Tochka Bank MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
