---
label: AWS WAF
icon: shield
order: 93
---

# AWS WAF (AmazonTask)

Solve Amazon AWS WAF captcha challenges. Supports both standard and challenge modes.

## Basic usage

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
