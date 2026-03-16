---
label: ReCaptcha v2 Enterprise
icon: shield-check
order: 99
---

# ReCaptcha v2 Enterprise

Solve Google reCAPTCHA v2 Enterprise challenges with additional enterprise-specific parameters.

## Basic usage

```ts
import { RecaptchaV2EnterpriseTask } from "node-capmonster"

const client = new RecaptchaV2EnterpriseTask("<api_key>")

const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "6Lcg7CMUAAAAANphynKgn9YAgA4tQ2KI_iqRyTwd",
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.gRecaptchaResponse)
```

## Request parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `websiteURL` | string | Yes | Page URL with the captcha |
| `websiteKey` | string | Yes | Site key |
| `pageAction` | string | No | Action parameter (e.g. `login_test`) |
| `enterprisePayload` | string | No | Additional params for `grecaptcha.enterprise.render` |
| `apiDomain` | string | No | Domain for reCAPTCHA loading (e.g. `www.recaptcha.net`) |
| `cookies` | string | No | Format: `name1=val1; name2=val2` |
| `noCache` | boolean | No | Force fresh token generation |

## Response

| Field | Type | Description |
|-------|------|-------------|
| `gRecaptchaResponse` | string | Token to insert into `textarea#g-recaptcha-response` |
