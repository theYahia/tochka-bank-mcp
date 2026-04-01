import type {
  TochkaAuthConfig,
  TochkaTokenResponse,
  TochkaAccount,
  TochkaBalance,
  TochkaStatement,
  TochkaPayment,
  TochkaCounterparty,
  TochkaCompanyInfo,
} from "./types.js";

const MAX_RETRIES = 3;
const RETRY_BASE_DELAY = 1000;

export class TochkaBankClient {
  private config: TochkaAuthConfig;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(config: TochkaAuthConfig) {
    this.config = config;
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    const resp = await fetch(`${this.config.baseUrl}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
      }),
    });

    if (!resp.ok) {
      throw new Error(`Tochka auth failed: ${resp.status} ${await resp.text()}`);
    }

    const data = (await resp.json()) as TochkaTokenResponse;
    this.accessToken = data.access_token;
    this.tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
    return this.accessToken;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: Record<string, unknown>,
    attempt = 1
  ): Promise<T> {
    const token = await this.getAccessToken();

    const resp = await fetch(`${this.config.baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (resp.status === 401) {
      this.accessToken = null;
      if (attempt <= 2) {
        return this.request<T>(method, path, body, attempt + 1);
      }
      throw new Error("Tochka authentication failed after retry");
    }

    if (resp.status === 429 && attempt <= MAX_RETRIES) {
      const delay = RETRY_BASE_DELAY * Math.pow(2, attempt - 1);
      await new Promise((r) => setTimeout(r, delay));
      return this.request<T>(method, path, body, attempt + 1);
    }

    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`Tochka API error ${resp.status}: ${errorText}`);
    }

    return resp.json() as Promise<T>;
  }

  async listAccounts(): Promise<TochkaAccount[]> {
    return this.request<TochkaAccount[]>("GET", "/open-banking/v2.0/accounts");
  }

  async getAccountBalance(accountId: string): Promise<TochkaBalance> {
    return this.request<TochkaBalance>(
      "GET",
      `/open-banking/v2.0/accounts/${accountId}/balance`
    );
  }

  async getStatement(
    accountId: string,
    dateFrom: string,
    dateTo: string
  ): Promise<TochkaStatement> {
    return this.request<TochkaStatement>(
      "GET",
      `/open-banking/v2.0/accounts/${accountId}/statements?dateFrom=${dateFrom}&dateTo=${dateTo}`
    );
  }

  async createPayment(params: {
    fromAccount: string;
    toInn: string;
    toBik: string;
    toAccount: string;
    amount: number;
    purpose: string;
  }): Promise<TochkaPayment> {
    return this.request<TochkaPayment>("POST", "/open-banking/v2.0/payments", {
      from_account: params.fromAccount,
      to_inn: params.toInn,
      to_bik: params.toBik,
      to_account: params.toAccount,
      amount: params.amount,
      purpose: params.purpose,
    });
  }

  async getPaymentStatus(paymentId: string): Promise<TochkaPayment> {
    return this.request<TochkaPayment>(
      "GET",
      `/open-banking/v2.0/payments/${paymentId}`
    );
  }

  async listCounterparties(): Promise<TochkaCounterparty[]> {
    return this.request<TochkaCounterparty[]>(
      "GET",
      "/open-banking/v2.0/counterparties"
    );
  }

  async createCounterparty(params: {
    name: string;
    inn: string;
    bik: string;
    account: string;
  }): Promise<TochkaCounterparty> {
    return this.request<TochkaCounterparty>(
      "POST",
      "/open-banking/v2.0/counterparties",
      params
    );
  }

  async getCompanyInfo(): Promise<TochkaCompanyInfo> {
    return this.request<TochkaCompanyInfo>(
      "GET",
      "/open-banking/v2.0/company-info"
    );
  }
}
