---
label: FunCaptcha
icon: apps
order: 97
---

# FunCaptcha (Arkose Labs)

Solve FunCaptcha / Arkose Labs challenges.

!!!warning
Do **NOT** load the captcha iframe to extract the `blob` value — this will invalidate it. Extract the blob from network requests instead.
!!!

## Basic usage

```ts
import { FuncaptchaTask } from "node-capmonster"

const client = new FuncaptchaTask("<api_key>")

const task = client.task({
    websiteURL: "https://example.com",
    websitePublicKey: "69A21A01-CC7B-B9C6-0F9A-E7FA06677FFC",
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.token)
```

## With blob data and subdomain

```ts
const task = client.task({
    websiteURL: "https://example.com",
    websitePublicKey: "69A21A01-CC7B-B9C6-0F9A-E7FA06677FFC",
    data: '{"blob":"value_from_network_request"}',
    funcaptchaApiJSSubdomain: "client-api.arkoselabs.com",
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
```

## With proxy and cookies

```ts
const client = new FuncaptchaTask("<api_key>")

client.setGlobalProxy({
    proxyType: "http",
    proxyAddress: "8.8.8.8",
    proxyPort: 8080,
    proxyLogin: "user",
    proxyPassword: "pass",
})

const task = client.task({
    websiteURL: "https://example.com",
    websitePublicKey: "69A21A01-CC7B-B9C6-0F9A-E7FA06677FFC",
    data: '{"blob":"extracted_blob_value"}',
    cookies: "session=abc123; _cfuid=xyz",
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.token)
```

## With error handling

```ts
import { FuncaptchaTask, CapmonsterError } from "node-capmonster"

const client = new FuncaptchaTask("<api_key>")

try {
    const task = client.task({
        websiteURL: "https://example.com",
        websitePublicKey: "69A21A01-CC7B-B9C6-0F9A-E7FA06677FFC",
    })
    const taskId = await client.createWithTask(task)
    const result = await client.joinTaskResult(taskId)

    console.log(result.token)
} catch (err) {
    if (err instanceof CapmonsterError) {
        console.error(`Error: ${err.errorCode} - ${err.errorDescription}`)
    }
}
```

## With User-Agent

```ts
const client = new FuncaptchaTask("<api_key>")

// Fetch the current valid UA from CapMonster Cloud
const ua = await client.getUserAgent()
client.setUserAgent(ua)

const task = client.task({
    websiteURL: "https://example.com",
    websitePublicKey: "69A21A01-CC7B-B9C6-0F9A-E7FA06677FFC",
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
```

## Request parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `websiteURL` | string | Yes | Page URL |
| `websitePublicKey` | string | No | FunCaptcha public key (`pk` parameter) |
| `funcaptchaApiJSSubdomain` | string | No | Arkose Labs subdomain (domain only, no `https://`) |
| `data` | string | No | JSON string with `blob` value |
| `cookies` | string | No | Format: `name1=val1; name2=val2` |
| `noCache` | boolean | No | Force fresh token generation |

## Response

| Field | Type | Description |
|-------|------|-------------|
| `token` | string | FunCaptcha token |
