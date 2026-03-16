---
label: Turnstile
icon: sync
order: 95
---

# Turnstile & Cloudflare Challenge

Solve Cloudflare Turnstile captchas and Cloudflare Challenge pages ("Just a moment...").

---

## Standard Turnstile

### Basic usage

```ts
import { TurnstileTask } from "node-capmonster"

const client = new TurnstileTask("<api_key>")

const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "0x4AAAAAAADnPIDROrmt1Wwj",
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.token)
```

---

## Cloudflare Challenge (token)

For Cloudflare Challenge pages that return a token:

```ts
const client = new TurnstileTask("<api_key>")

const ua = await client.getUserAgent()

const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "0x4AAAAAAADnPIDROrmt1Wwj",
    cloudflareTaskType: "token",
    pageAction: "managed",
    data: "<cData_value>",
    pageData: "<chlPageData_value>",
    userAgent: ua,
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.token)
console.log(result.userAgent)
```

---

## Cloudflare Challenge (cf_clearance)

Returns a `cf_clearance` cookie. **Your own proxy is required.**

```ts
const client = new TurnstileTask("<api_key>")

const ua = await client.getUserAgent()

// Get the 403 page HTML and encode it
const response = await fetch("https://example.com")
const html = await response.text()
const htmlBase64 = Buffer.from(html).toString("base64")

const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "anything",
    cloudflareTaskType: "cf_clearance",
    htmlPageBase64: htmlBase64,
    userAgent: ua,
    proxy: {
        proxyType: "http",
        proxyAddress: "1.2.3.4",
        proxyPort: 8080,
        proxyLogin: "user", // optional
        proxyPassword: "pass", // optional
    },
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.cf_clearance)
```

---

## Request parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `websiteURL` | string | Yes | Page URL |
| `websiteKey` | string | Yes | Turnstile site key |
| `pageAction` | string | No | Action field from callback |
| `data` | string | No | Value from `cData` parameter |
| `cloudflareTaskType` | string | No | `"token"` or `"cf_clearance"` for Challenge pages |
| `pageData` | string | No | Value from `chlPageData` (token mode) |
| `htmlPageBase64` | string | No | Base64-encoded 403 page (cf_clearance mode) |
| `userAgent` | string | No | Browser UA (required for Challenge) |
| `apiJsUrl` | string | No | Captcha script URL |

## Response

| Field | Type | Description |
|-------|------|-------------|
| `token` | string | Turnstile token |
| `userAgent` | string | UA used during solving |
| `cf_clearance` | string | cf_clearance cookie (only for cf_clearance mode) |
