# faultyfox-site

Company site for Faulty Fox Studios, served at faultyfox.com on Cloudflare Pages.

- `public/index.html`: the whole site (edit text here)
- `functions/api/waitlist.js`: waitlist signups, stored in the `WAITLIST` KV namespace

## Run locally

```bash
npx wrangler pages dev
```

## Deploy

```bash
npx wrangler pages deploy
```

## Export the waitlist

```bash
npx wrangler kv key list --binding WAITLIST --remote
```
