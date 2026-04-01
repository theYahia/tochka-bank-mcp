import { z } from "zod";
import type { TochkaBankClient } from "../client.js";

export const createPaymentTool = {
  name: "create_payment",
  description:
    "Create a new payment in Tochka Bank. Send funds to a counterparty using their INN, BIK, and account number.",
  inputSchema: z.object({
    from_account: z.string().describe("Source account number"),
    to_inn: z.string().describe("Recipient INN (tax ID)"),
    to_bik: z.string().describe("Recipient bank BIK (9 digits)"),
    to_account: z.string().describe("Recipient account number"),
    amount: z.number().positive().describe("Amount in minor units (kopeks)"),
    purpose: z.string().describe("Payment purpose description"),
  }),
  handler: async (
    client: TochkaBankClient,
    args: {
      from_account: string;
      to_inn: string;
      to_bik: string;
      to_account: string;
      amount: number;
      purpose: string;
    }
  ) => {
    const payment = await client.createPayment({
      fromAccount: args.from_account,
      toInn: args.to_inn,
      toBik: args.to_bik,
      toAccount: args.to_account,
      amount: args.amount,
      purpose: args.purpose,
    });
    return { content: [{ type: "text" as const, text: JSON.stringify(payment, null, 2) }] };
  },
};

export const getPaymentStatusTool = {
  name: "get_payment_status",
  description:
    "Check the status of a previously created payment in Tochka Bank.",
  inputSchema: z.object({
    payment_id: z.string().describe("The payment ID"),
  }),
  handler: async (client: TochkaBankClient, args: { payment_id: string }) => {
    const status = await client.getPaymentStatus(args.payment_id);
    return { content: [{ type: "text" as const, text: JSON.stringify(status, null, 2) }] };
  },
};
