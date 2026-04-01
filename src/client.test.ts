import { describe, it, expect, vi, beforeEach } from "vitest";
import { TochkaBankClient } from "./client.js";

const mockConfig = {
  clientId: "test-client-id",
  clientSecret: "test-client-secret",
  baseUrl: "https://test.tochka.com",
};

describe("TochkaBankClient", () => {
  let client: TochkaBankClient;

  beforeEach(() => {
    client = new TochkaBankClient(mockConfig);
    vi.restoreAllMocks();
  });

  it("should authenticate and list accounts", async () => {
    const mockAccounts = [
      { accountId: "acc1", accountNumber: "40702810000000001234", bankBik: "044525999", currency: "RUB", accountType: "CHECKING", status: "ACTIVE" },
    ];

    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: "tok123", token_type: "Bearer", expires_in: 3600 }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAccounts,
      } as Response);

    const result = await client.listAccounts();
    expect(result).toEqual(mockAccounts);
  });

  it("should get account balance", async () => {
    const mockBalance = { accountId: "acc1", amount: 250000, currency: "RUB", date: "2026-04-01" };

    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: "tok123", token_type: "Bearer", expires_in: 3600 }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockBalance,
      } as Response);

    const result = await client.getAccountBalance("acc1");
    expect(result.amount).toBe(250000);
  });

  it("should create a payment", async () => {
    const mockPayment = {
      id: "pay1",
      status: "CREATED",
      fromAccount: "40702810000000001234",
      toInn: "7707083893",
      toBik: "044525225",
      toAccount: "40702810000000005678",
      amount: 100000,
      currency: "RUB",
      purpose: "Test payment",
      createdAt: "2026-04-01T12:00:00Z",
    };

    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: "tok123", token_type: "Bearer", expires_in: 3600 }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPayment,
      } as Response);

    const result = await client.createPayment({
      fromAccount: "40702810000000001234",
      toInn: "7707083893",
      toBik: "044525225",
      toAccount: "40702810000000005678",
      amount: 100000,
      purpose: "Test payment",
    });
    expect(result.id).toBe("pay1");
  });

  it("should retry on 429 rate limit", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: "tok123", token_type: "Bearer", expires_in: 3600 }),
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () => "Rate limited",
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: "tok123", token_type: "Bearer", expires_in: 3600 }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

    const result = await client.listAccounts();
    expect(result).toEqual([]);
  });

  it("should throw on HTTP error", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: "tok123", token_type: "Bearer", expires_in: 3600 }),
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => "Internal Server Error",
      } as Response);

    await expect(client.listAccounts()).rejects.toThrow("Tochka API error 500");
  });

  it("should create counterparty", async () => {
    const mockCounterparty = {
      id: "cp1",
      name: "Test Company",
      inn: "7707083893",
      bik: "044525225",
      account: "40702810000000005678",
    };

    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: "tok123", token_type: "Bearer", expires_in: 3600 }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCounterparty,
      } as Response);

    const result = await client.createCounterparty({
      name: "Test Company",
      inn: "7707083893",
      bik: "044525225",
      account: "40702810000000005678",
    });
    expect(result.name).toBe("Test Company");
  });

  it("should get company info", async () => {
    const mockInfo = {
      name: "My Company LLC",
      inn: "7707083893",
      kpp: "770701001",
      ogrn: "1027700132195",
      address: "Moscow, Russia",
      director: "Ivan Ivanov",
      registrationDate: "2020-01-15",
    };

    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: "tok123", token_type: "Bearer", expires_in: 3600 }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockInfo,
      } as Response);

    const result = await client.getCompanyInfo();
    expect(result.inn).toBe("7707083893");
  });
});
