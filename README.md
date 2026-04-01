# @theyahia/tochka-bank-mcp

MCP server for Tochka Bank Business API. Manage business accounts, create payments, track counterparties, and access company information.

## Install

```bash
npx -y @theyahia/tochka-bank-mcp
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TOCHKA_CLIENT_ID` | Yes | OAuth 2.0 client ID from Tochka developer portal |
| `TOCHKA_CLIENT_SECRET` | Yes | OAuth 2.0 client secret |
| `TOCHKA_BASE_URL` | No | API base URL (default: `https://enter.tochka.com/api/v2`) |

## Tools

| Tool | Description |
|------|-------------|
| `list_accounts` | List all business accounts |
| `get_account_balance` | Get current balance for an account |
| `get_statement` | Get transactions for a date range |
| `create_payment` | Create a new payment order |
| `get_payment_status` | Check payment status |
| `list_counterparties` | List saved business counterparties |
| `create_counterparty` | Add a new counterparty |
| `get_company_info` | Get your company details (INN, OGRN, etc.) |

## Demo Prompts

1. "Show me all my Tochka Bank accounts and their balances"
2. "Create a payment of 75,000 RUB to INN 7707083893, BIK 044525225, account 40702810000000005678 for web development services"
3. "Get my company registration info from Tochka Bank"

## License

MIT
