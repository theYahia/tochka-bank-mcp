import { z } from "zod";
import type { TochkaBankClient } from "../client.js";

export const listCounterpartiesTool = {
  name: "list_counterparties",
  description:
    "List all saved counterparties in Tochka Bank. Returns names, INN, BIK, and account numbers.",
  inputSchema: z.object({}),
  handler: async (client: TochkaBankClient) => {
    const counterparties = await client.listCounterparties();
    return { content: [{ type: "text" as const, text: JSON.stringify(counterparties, null, 2) }] };
  },
};

export const createCounterpartyTool = {
  name: "create_counterparty",
  description:
    "Create a new counterparty (business partner) in Tochka Bank for future payments.",
  inputSchema: z.object({
    name: z.string().describe("Counterparty company name"),
    inn: z.string().describe("Counterparty INN (tax ID)"),
    bik: z.string().describe("Counterparty bank BIK (9 digits)"),
    account: z.string().describe("Counterparty account number"),
  }),
  handler: async (
    client: TochkaBankClient,
    args: { name: string; inn: string; bik: string; account: string }
  ) => {
    const counterparty = await client.createCounterparty(args);
    return { content: [{ type: "text" as const, text: JSON.stringify(counterparty, null, 2) }] };
  },
};

export const getCompanyInfoTool = {
  name: "get_company_info",
  description:
    "Get your company information from Tochka Bank, including name, INN, KPP, OGRN, address, and director.",
  inputSchema: z.object({}),
  handler: async (client: TochkaBankClient) => {
    const info = await client.getCompanyInfo();
    return { content: [{ type: "text" as const, text: JSON.stringify(info, null, 2) }] };
  },
};
