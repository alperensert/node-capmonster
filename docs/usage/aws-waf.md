---
label: AWS WAF
icon: shield
order: 93
---

# AWS WAF (AmazonTask)

Solve Amazon AWS WAF captcha challenges. Supports both standard and challenge modes.

## Standard mode (cookie solution)

```ts
import { AmazonTask } from "node-capmonster"

const client = new AmazonTask("<api_key>")

const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "<window.gokuProps.key>",
    captchaScript: "https://example.com/captcha.js",
    cookieSolution: true,
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.cookies)    // { "aws-waf-token": "..." }
console.log(result.userAgent)  // UA used during solving
```

## Standard mode (voucher solution)

```ts
const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "<window.gokuProps.key>",
    captchaScript: "https://example.com/captcha.js",
    // cookieSolution defaults to false
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.captcha_voucher)
console.log(result.existing_token)
```

## Challenge mode

When the challenge script, context, and IV are required:

```ts
const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "<window.gokuProps.key>",
    captchaScript: "https://example.com/captcha.js",
    challengeScript: "https://example.com/challenge.js",
    context: "<window.gokuProps.context>",
    iv: "<window.gokuProps.iv>",
    cookieSolution: true,
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.cookies)
```

## With proxy

```ts
const client = new AmazonTask("<api_key>")

client.setGlobalProxy({
    proxyType: "http",
    proxyAddress: "8.8.8.8",
    proxyPort: 8080,
})

const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "<aws_waf_key>",
    captchaScript: "https://example.com/captcha.js",
    cookieSolution: true,
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
```

## With error handling

```ts
import { AmazonTask, CapmonsterError } from "node-capmonster"

const client = new AmazonTask("<api_key>")

try {
    const task = client.task({
        websiteURL: "https://example.com",
        websiteKey: "<aws_waf_key>",
        captchaScript: "https://example.com/captcha.js",
        cookieSolution: true,
    })
    const taskId = await client.createWithTask(task)
    const result = await client.joinTaskResult(taskId)

    // Use the cookie in subsequent requests
    const wafToken = result.cookies?.["aws-waf-token"]
    console.log("WAF Token:", wafToken)
} catch (err) {
    if (err instanceof CapmonsterError) {
        console.error(`Error: ${err.errorCode} - ${err.errorDescription}`)
    }
}
```

## Request parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `websiteURL` | string | Yes | Page URL |
| `websiteKey` | string | Yes | AWS WAF key (`window.gokuProps.key`) |
| `captchaScript` | string | Yes | URL of captcha.js |
| `challengeScript` | string | No | URL of challenge.js (challenge mode) |
| `context` | string | No | Context value (challenge mode) |
| `iv` | string | No | IV value (challenge mode) |
| `cookieSolution` | boolean | No | `true` to get solution as cookies |

## Response

When `cookieSolution: true`:

| Field | Type | Description |
|-------|------|-------------|
| `cookies` | object | Contains `aws-waf-token` |
| `userAgent` | string | UA used during solving |

When `cookieSolution: false` (default):

| Field | Type | Description |
|-------|------|-------------|
| `captcha_voucher` | string | Captcha voucher |
| `existing_token` | string | Existing token |
