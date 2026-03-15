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

// Proxy is required for Imperva
client.setGlobalProxy({
    proxyType: "http",
    proxyAddress: "1.2.3.4",
    proxyPort: 8080,
})

const task = client.task({
    websiteURL: "https://protected-site.com",
    metadata: {
        incapsulaScriptUrl: "https://protected-site.com/_Incapsula_Resource?...",
        incapsulaCookies: "visid_incap=abc123; incap_ses_874=xyz789",
        reese84UrlEndpoint: "https://protected-site.com/a3fE8dK",
    },
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.domains)
```

## Full workflow example

```ts
import { ImpervaTask, CapmonsterError } from "node-capmonster"

const client = new ImpervaTask("<api_key>")

client.setGlobalProxy({
    proxyType: "http",
    proxyAddress: "1.2.3.4",
    proxyPort: 8080,
    proxyLogin: "user",
    proxyPassword: "pass",
})

try {
    // 1. Extract the required values from the protected page
    const incapsulaScriptUrl = "https://protected-site.com/_Incapsula_Resource?SWJIYLWA=..."
    const incapsulaCookies = "visid_incap=abc; incap_ses_874=xyz; nlbi_874=def"
    const reese84UrlEndpoint = "https://protected-site.com/a3fE8dK"

    // 2. Create the task
    const task = client.task({
        websiteURL: "https://protected-site.com",
        metadata: {
            incapsulaScriptUrl,
            incapsulaCookies,
            reese84UrlEndpoint,
        },
    })

    const taskId = await client.createWithTask(task)
    const result = await client.joinTaskResult(taskId)

    // 3. Extract and use the new cookies
    console.log(result.domains)
    // {
    //   "protected-site.com": {
    //     cookies: {
    //       visid_incap: "new_value...",
    //       incap_ses_874: "new_value..."
    //     }
    //   }
    // }
} catch (err) {
    if (err instanceof CapmonsterError) {
        console.error(`Error: ${err.errorCode} - ${err.errorDescription}`)
    }
}
```

## With SOCKS5 proxy

```ts
const client = new ImpervaTask("<api_key>")

client.setGlobalProxy({
    proxyType: "socks5",
    proxyAddress: "10.0.0.1",
    proxyPort: 1080,
})

const task = client.task({
    websiteURL: "https://protected-site.com",
    metadata: {
        incapsulaScriptUrl: "https://protected-site.com/_Incapsula_Resource?...",
        incapsulaCookies: "visid_incap=abc; incap_ses_874=xyz",
        reese84UrlEndpoint: "https://protected-site.com/a3fE8dK",
    },
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
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
