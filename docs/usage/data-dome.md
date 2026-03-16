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

const task = client.task({
    websiteURL: "https://example.com",
    metadata: {
        htmlPageBase64: "<base64_encoded_page>",
        captchaUrl: "https://geo.captcha-delivery.com/captcha/?initialCid=...",
        datadomeCookie: "datadome=<cookie_value>",
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
| `websiteURL` | string | Yes | Main page URL (not captcha URL) |
| `metadata.htmlPageBase64` | string | Yes | Base64-encoded HTML of the 403 page |
| `metadata.captchaUrl` | string | Yes | Full DataDome captcha page URL |
| `metadata.datadomeCookie` | string | Yes | `datadome` cookie value |

## Response

| Field | Type | Description |
|-------|------|-------------|
| `domains` | object | Cookies to inject, keyed by domain |
