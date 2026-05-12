# Architecture

Monorepo (Bun workspaces) for the Mănăstirea Saharna site. Two apps live under `apps/`:

```
manastirea-saharna/
├── apps/
│   ├── client/   # public static site
│   └── cms/      # content management backend
└── package.json  # workspace root
```

## Contents

- [`apps/client`](#appsclient) — public static site (Astro + Qwik + Tailwind, i18n, contact form UI)
- [`apps/cms`](#appscms) — Payload backend for editors, fires the rebuild
- [Hosting & cost](#hosting--cost) — free-tier service map and the constraints it forces
- [Contact form](#contact-form) — visitor → Worker → Resend → monastery
  - [Alternatives considered](#alternatives-considered) — Payload `sendEmail()`, Gmail+whitelist, Zoho SMTP
- [Email sending](#email-sending) — provider comparison, DNS, deliverability
  - [Quota headroom](#quota-headroom) — free-tier ceilings vs expected load
- [Build & deploy flow](#build--deploy-flow) — publish hook → `repository_dispatch` → static rebuild
- [Conventions](#conventions) — TypeScript, lint/format, path aliases, runtime pins

## `apps/client`

Public-facing static site.

- **Stack:** Astro (static output, `output: "static"`) + Qwik islands (`@qwikdev/astro`) + Tailwind v4.
- **i18n:** `astro-i18n-aut` with three locales — `ro` (default), `en`, `ru`. Translations live in `src/i18n/index.ts`; the request locale is resolved in `src/middleware.ts` and exposed on `context.locals.lang`.
- **Forms:** one contact form — visitor enters their email + message, the monastery receives it as a regular email with the visitor's address in `Reply-To` so hitting "Reply" returns directly to them. Submission flow lives in a Cloudflare Worker, not on the site itself (see [Contact form](#contact-form)).
- **Build:** `bun run build:client` produces `apps/client/dist/`, deployed as static assets.

## `apps/cms`

Backend for editors to create and manage posts. Currently scaffolded (empty) — planned stack is **Payload CMS** (Node + TypeScript, self-hosted), chosen for its extensibility: custom collections, fields, hooks, and access control are all just code.

- Stores post content + media (Payload + a database — Postgres or MongoDB — and a media adapter, e.g. local disk or S3-compatible storage).
- Exposes the Payload admin UI for editors and an auto-generated REST/GraphQL API.
- On publish (`afterChange` hook on the relevant collections), fires a GitHub `repository_dispatch` to kick off the client redeploy workflow.
- Single-user (one editor), low-traffic admin — sizing decisions can assume "cold most of the time, occasional bursts when publishing."

## Hosting & cost

Goal: **zero recurring runtime cost.** Everything lives on free tiers.

| Piece               | Service                                                                         | Why                                                                                 |
| ------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Static client       | **GitHub Pages**                                                                | Free, unlimited for public repos; deploys straight from CI.                         |
| Image / media       | **Cloudflare R2** bucket                                                        | Free egress, generous free storage; S3-compatible API for Payload's media adapter.  |
| Database            | **Neon** (Postgres) — or Railway / similar free tier                            | Neon free tier scales to zero; fine for a single-editor CMS.                        |
| CMS runtime         | Any free Node host (Railway, Render, Fly.io free app, Payload Cloud free, etc.) | Only needs to be reachable when the one editor logs in; cold starts are acceptable. |
| Form handler        | **Cloudflare Worker**                                                           | Free 100 k req/day; decouples the contact form from CMS uptime.                     |
| Transactional email | **Resend** free tier (3 k/mo, 100/day) — fallback Brevo (300/day)               | Worker calls Resend's API to forward the form to the monastery inbox.               |
| Build / deploy      | **GitHub Actions**                                                              | Free CI minutes on public repos cover the occasional rebuild.                       |

Constraints this places on design choices:
- The CMS host **may sleep** between sessions — the editor flow must tolerate cold starts; the public site never depends on it being up.
- Media URLs must be **public R2 URLs** baked into the static build, so the live site doesn't proxy through the CMS.
- DB choice should support **scale-to-zero / generous free tier**; Neon is the default pick, but the schema stays portable (vanilla Postgres) so we can swap hosts without code changes.

## Contact form

The site has one public form. The visitor types their email and a message; a Cloudflare Worker sends **one** email to the monastery's inbox, authenticated against our own domain (`manastirea-saharna.md`) via Resend. **After that, our system is out of the loop** — the monastery hits "Reply" in their normal mail client (Gmail, Outlook, whatever they use) and the thread continues directly between them and the visitor. We never see the reply.

```
visitor (types email + message)
        │
        ▼
  Cloudflare Worker  ── Turnstile + honeypot check
        │
        ▼
   Resend            ── From:     noreply@manastirea-saharna.md
        │                Reply-To: <visitor email>
        │                To:       <monastery inbox>
        ▼
  monastery inbox    ── monastery hits "Reply"
                          │
                          ▼
                    rest of the conversation lives in normal email,
                    end-to-end between the monastery and the visitor.
                    Our infrastructure is no longer involved.
```

- **"Our email server" = our domain on Resend.** Resend is the SMTP infrastructure, but `From:` and the DKIM/SPF authority both live on `manastirea-saharna.md`. To the recipient it's just a regular email from our domain.
- **Recipient address.** We do not provision an inbox for the monastery — `To:` is whatever email address they already use (personal Gmail, hosting-provider mailbox, anything that can receive mail). The Worker reads this from an env var, so changing the recipient later is a one-line config update with no code change.
- **Cloudflare Worker, not the Payload server** — the public form has no runtime dependency on the CMS. The Worker has zero cold start, exposes a single hardened endpoint (Turnstile + honeypot) rather than the CMS admin surface, keeps the Resend API key off both the static site and the CMS process, and stays up when the CMS host sleeps or is restarted.
- **Anti-spam** — Cloudflare Turnstile + a hidden honeypot, both verified server-side in the Worker before any email is sent.
- **One-time setup** — verify the sending domain in Resend (DNS: SPF + DKIM records).
- **No storage** — the email is the only record. The Worker doesn't persist submissions and the Payload database is not involved.

### Alternatives considered

- **Payload `sendEmail()` (CMS-hosted form handler)** — viable, removes one service. Rejected because the public form would then depend on the CMS host being awake; on a free-tier Node host, the first submission after idle waits 30–60 s for Payload to boot, and the CMS endpoint becomes a public POST target sharing process and rate-limit budget with the admin. Worth reconsidering if the CMS ever migrates to an always-on tier.
- **Gmail SMTP from a dedicated account + monastery-side whitelist** — minimum-effort path: no DNS work, no vendor signup, monastery adds one filter rule ("never send to spam, from: this address"). Rejected as the default because (a) Workers can't open outbound SMTP, so it forces the Payload route and inherits the cold-start problem, (b) personal Gmail is not intended for automated transactional mail and the account can be throttled or suspended, (c) deliverability hinges on the recipient-side filter, which is fragile across mailbox migrations.
- **Zoho Mail free SMTP** — clean DKIM signing on our domain, $0, no Resend dependency. Preferred fallback if Resend goes away and we want a non-Resend relay.

## Email sending

The Worker sends mail through an HTTP-based provider — Cloudflare Workers can't open outbound SMTP connections, so SMTP libraries are off the table. Free tiers that actually exist in 2026:

| Service        | Free tier               | Send from our domain | Notes                        |
| -------------- | ----------------------- | -------------------- | ---------------------------- |
| **Resend**     | 3 k / mo, 100 / day     | yes (SPF + DKIM)     | Default pick — cleanest API. |
| **Brevo**      | 300 / day forever       | yes (SPF + DKIM)     | Documented fallback.         |
| **MailerSend** | 3 k / mo                | yes (SPF + DKIM)     | Similar profile to Resend.   |
| MailChannels   | ~~free for CF Workers~~ | —                    | Killed mid-2024. Skip.       |

- **Volume reality:** a monastery contact form sees maybe 5–50 submissions/month — the free-tier limits give 2–3 orders of magnitude headroom. The realistic risk is **provider deprecation** (as MailChannels showed), not volume.
- **Swap cost is contained:** the Worker is the only piece that knows the provider. Migrating off Resend = change the HTTP endpoint + JSON body shape, ~30 lines. The static site and the CMS are unaffected.
- **One-time DNS:** add 2–3 TXT records (SPF, DKIM, optionally DMARC) for `manastirea-saharna.md`. Resend/Brevo give the exact values. Without this, mail lands in spam or gets refused. DNS lives in Cloudflare alongside R2 — already set up.
- **Deliverability fallback:** even with SPF + DKIM correctly configured, mail to a low-reputation domain occasionally lands in spam on first contact. A one-time filter rule on the monastery's inbox (Gmail: *Settings → Filters → From: `noreply@manastirea-saharna.md` → Never send to spam*) guarantees delivery without further DNS or code changes. Worth including in the handover notes for the monastery.

### Quota headroom

The relevant free-tier ceilings against an expected load of ~50 form submissions/month:

| Limit                           | Cap               | Expected use | Headroom  |
| ------------------------------- | ----------------- | ------------ | --------- |
| Resend emails                   | 3 000 / month     | ~50 / month  | ~60×      |
| Resend emails (daily)           | 100 / day         | < 5 / day    | > 20×     |
| Cloudflare Worker requests      | 100 000 / day     | < 10 / day   | > 10 000× |
| Cloudflare Turnstile challenges | 1 000 000 / month | ~500 / month | ~2 000×   |

The realistic failure mode is provider deprecation (as MailChannels showed), not exceeding any quota.

## Build & deploy flow

```
editor ──▶ Payload admin ──▶ (publish hook) ──▶ repository_dispatch
                                                       │
                                                       ▼
                                              GitHub Actions ──▶ build client ──▶ deploy static site
                                                       ▲
                                                       └── also runs on push to main
```

- Content changes never hit the live site directly; every publish is a full static rebuild.
- The client has no runtime dependency on the CMS — at request time it serves pre-rendered HTML only.

## Conventions

- TypeScript everywhere; shared lint/format config at the repo root (`eslint.config.mjs`, `prettier.config.mjs`).
- Path aliases in `apps/client`: `@i18n`, `@layouts`, `@utils`, `@components`.
- Runtime pinned via `.tool-versions` (Bun 1.2.19, Node LTS).
