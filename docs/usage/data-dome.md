---
label: Data Dome
icon: lock
order: 91
---

# Data Dome

Solve DataDome captcha challenges. **Proxy is required.**

## Basic usage

```ts
import { DataDomeTask } from "node-capmonster"

const client = new DataDomeTask("<api_key>")

// Proxy is required for DataDome
client.setGlobalProxy({
    proxyType: "http",
    proxyAddress: "1.2.3.4",
    proxyPort: 8080,
})

const task = client.task({
    websiteURL: "https://example.com",
    metadata: {
        htmlPageBase64: "<base64_encoded_page>",
        captchaUrl: "https://geo.captcha-delivery.com/captcha/?initialCid=...",
        datadomeCookie: "datadome=<cookie_value>",
    },
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.domains)
```

## Full workflow example

```ts
import { DataDomeTask, CapmonsterError } from "node-capmonster"

const client = new DataDomeTask("<api_key>")

client.setGlobalProxy({
    proxyType: "http",
    proxyAddress: "1.2.3.4",
    proxyPort: 8080,
    proxyLogin: "user",
    proxyPassword: "pass",
})

try {
    // 1. Fetch the target page — get the 403 response and datadome cookie
    const pageHtml = "<html>...</html>" // 403 page HTML
    const htmlBase64 = Buffer.from(pageHtml).toString("base64")
    const datadomeCookie = "datadome=abc123xyz..."
    const captchaUrl = "https://geo.captcha-delivery.com/captcha/?initialCid=..."

    // 2. Create the task
    const task = client.task({
        websiteURL: "https://example.com",
        metadata: {
            htmlPageBase64: htmlBase64,
            captchaUrl,
            datadomeCookie,
        },
    })

    const taskId = await client.createWithTask(task)
    const result = await client.joinTaskResult(taskId)

    // 3. Extract the new cookies from the solution
    console.log(result.domains)
    // {
    //   "example.com": {
    //     cookies: {
    //       datadome: "new_datadome_cookie_value; Max-Age=..."
    //     }
    //   }
    // }
} catch (err) {
    if (err instanceof CapmonsterError) {
        console.error(`Error: ${err.errorCode} - ${err.errorDescription}`)
    }
}
```

## With proxy authentication

```ts
const client = new DataDomeTask("<api_key>")

client.setGlobalProxy({
    proxyType: "socks5",
    proxyAddress: "10.0.0.1",
    proxyPort: 1080,
    proxyLogin: "proxyuser",
    proxyPassword: "proxypass",
})

const task = client.task({
    websiteURL: "https://example.com",
    metadata: {
        htmlPageBase64: "<base64_page>",
        captchaUrl: "https://geo.captcha-delivery.com/captcha/?...",
        datadomeCookie: "datadome=abc",
    },
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
```

## Request parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `websiteURL` | string | Yes | Main page URL (not captcha URL) |
| `metadata.htmlPageBase64` | string | Yes | Base64-encoded HTML of the 403 page |
| `metadata.captchaUrl` | string | Yes | Full DataDome captcha page URL |
| `metadata.datadomeCookie` | string | Yes | `datadome` cookie value |

## Response

| Field | Type | Description |
|-------|------|-------------|
| `domains` | object | Cookies to inject, keyed by domain |
