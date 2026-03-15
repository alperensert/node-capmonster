---
label: ReCaptcha v3
icon: shield-check
order: 98
---

# ReCaptcha v3

Solve Google reCAPTCHA v3 challenges. Always uses built-in proxies (no custom proxy support).

## Finding parameters

- **websiteKey**: Found in `api.js?render=THIS_ONE` in the page source.

## Basic usage

```ts
import { RecaptchaV3Task } from "node-capmonster"

const client = new RecaptchaV3Task("<api_key>")

const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "6Le-wvkSVAAAExE_szVSP2n",
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.gRecaptchaResponse)
```

## With score and action

```ts
const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "6Le-wvkSVAAAExE_szVSP2n",
    minScore: 0.7,
    pageAction: "login",
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
```

## Enterprise mode

Set `isEnterprise: true` to solve as reCAPTCHA v3 Enterprise:

```ts
const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "6Le-wvkSVAAAExE_szVSP2n",
    isEnterprise: true,
    minScore: 0.9,
    pageAction: "checkout",
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
```

## With error handling and nocache

```ts
import { RecaptchaV3Task, CapmonsterError } from "node-capmonster"

const client = new RecaptchaV3Task("<api_key>")

try {
    const task = client.task({
        websiteURL: "https://example.com",
        websiteKey: "6Le-wvkSVAAAExE_szVSP2n",
        minScore: 0.7,
        pageAction: "submit",
        noCache: true,
    })
    const taskId = await client.createWithTask(task)
    const result = await client.joinTaskResult(taskId)

    console.log(result.gRecaptchaResponse)
} catch (err) {
    if (err instanceof CapmonsterError) {
        console.error(`Error: ${err.errorCode}`)
    }
}
```

## Non-blocking polling

```ts
const taskId = await client.createWithTask(task)

const poll = setInterval(async () => {
    const result = await client.getTaskResult(taskId)
    if (result !== null) {
        clearInterval(poll)
        console.log(result.gRecaptchaResponse)
    }
}, 3000)
```

## Request parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `websiteURL` | string | Yes | Page URL |
| `websiteKey` | string | Yes | Site key from `api.js?render=` |
| `minScore` | number | No | Desired score: `0.1` to `0.9` |
| `pageAction` | string | No | Action value (default: `verify`) |
| `isEnterprise` | boolean | No | Solve as Enterprise variant |
| `noCache` | boolean | No | Force fresh token generation |

## Response

| Field | Type | Description |
|-------|------|-------------|
| `gRecaptchaResponse` | string | Token for form submission |
