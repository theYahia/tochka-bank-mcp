export interface TochkaAuthConfig {
  clientId: string;
  clientSecret: string;
  baseUrl: string;
}

export interface TochkaTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

export interface TochkaAccount {
  accountId: string;
  accountNumber: string;
  bankBik: string;
  currency: string;
  accountType: string;
  status: string;
}

export interface TochkaBalance {
  accountId: string;
  amount: number;
  currency: string;
  date: string;
}

export interface TochkaStatementEntry {
  id: string;
  date: string;
  amount: number;
  currency: string;
  purpose: string;
  counterpartyName: string;
  counterpartyInn: string;
  counterpartyAccount: string;
  counterpartyBik: string;
  direction: "CREDIT" | "DEBIT";
}

export interface TochkaStatement {
  accountId: string;
  dateFrom: string;
  dateTo: string;
  openingBalance: number;
  closingBalance: number;
  entries: TochkaStatementEntry[];
}

export interface TochkaPayment {
  id: string;
  status: string;
  fromAccount: string;
  toInn: string;
  toBik: string;
  toAccount: string;
  amount: number;
  currency: string;
  purpose: string;
  createdAt: string;
}

export interface TochkaCounterparty {
  id: string;
  name: string;
  inn: string;
  kpp?: string;
  bik: string;
  account: string;
}

export interface TochkaCompanyInfo {
  name: string;
  inn: string;
  kpp: string;
  ogrn: string;
  address: string;
  director: string;
  registrationDate: string;
}

export interface TochkaApiError {
  code: string;
  message: string;
  details?: string;
}
