---
label: Imperva
icon: lock
order: 90
---

# Imperva (Incapsula)

Solve Imperva/Incapsula anti-bot challenges. **Proxy is required.**

## Basic usage

```ts
import { ImpervaTask } from "node-capmonster"

const client = new ImpervaTask("<api_key>")

const task = client.task({
    websiteURL: "https://protected-site.com",
    metadata: {
        incapsulaScriptUrl: "https://protected-site.com/_Incapsula_Resource?...",
        incapsulaCookies: "visid_incap=abc123; incap_ses_874=xyz789",
        reese84UrlEndpoint: "https://protected-site.com/a3fE8dK",
    },
    proxy: {
        proxyType: "http",
        proxyAddress: "1.2.3.4",
        proxyPort: 8080,
    },
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.domains)
```

## Request parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `websiteURL` | string | Yes | Page URL |
| `metadata.incapsulaScriptUrl` | string | Yes | Incapsula script URL |
| `metadata.incapsulaCookies` | string | Yes | Incapsula cookies from the site |
| `metadata.reese84UrlEndpoint` | string | Yes | Reese84 URL endpoint |

## Response

| Field | Type | Description |
|-------|------|-------------|
| `domains` | object | Cookies to inject, keyed by domain |
