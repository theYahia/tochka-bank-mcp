import { z } from "zod";
import type { TochkaBankClient } from "../client.js";

export const listAccountsTool = {
  name: "list_accounts",
  description:
    "List all business accounts in Tochka Bank. Returns account numbers, currencies, types, and statuses.",
  inputSchema: z.object({}),
  handler: async (client: TochkaBankClient) => {
    const accounts = await client.listAccounts();
    return { content: [{ type: "text" as const, text: JSON.stringify(accounts, null, 2) }] };
  },
};

export const getAccountBalanceTool = {
  name: "get_account_balance",
  description:
    "Get the current balance of a specific Tochka Bank account by its ID.",
  inputSchema: z.object({
    account_id: z.string().describe("The unique account identifier"),
  }),
  handler: async (client: TochkaBankClient, args: { account_id: string }) => {
    const balance = await client.getAccountBalance(args.account_id);
    return { content: [{ type: "text" as const, text: JSON.stringify(balance, null, 2) }] };
  },
};

export const getStatementTool = {
  name: "get_statement",
  description:
    "Get account statement (transactions) from Tochka Bank for a date range.",
  inputSchema: z.object({
    account_id: z.string().describe("The unique account identifier"),
    date_from: z.string().describe("Start date in YYYY-MM-DD format"),
    date_to: z.string().describe("End date in YYYY-MM-DD format"),
  }),
  handler: async (
    client: TochkaBankClient,
    args: { account_id: string; date_from: string; date_to: string }
  ) => {
    const statement = await client.getStatement(
      args.account_id,
      args.date_from,
      args.date_to
    );
    return { content: [{ type: "text" as const, text: JSON.stringify(statement, null, 2) }] };
  },
};
