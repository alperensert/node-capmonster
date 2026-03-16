---
label: ReCaptcha v2
icon: shield-check
order: 100
---

# ReCaptcha v2

Solve Google reCAPTCHA v2 challenges. Tokens are valid for 60 seconds after solving.

## Finding parameters

- **websiteKey**: Look for `data-sitekey` in the HTML, or the `k=` parameter in the reCAPTCHA iframe URL.
- **isInvisible**: Check for `size="invisible"` in the captcha element.

## Basic usage

```ts
import { RecaptchaV2Task } from "node-capmonster"

const client = new RecaptchaV2Task("<api_key>")

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
| `websiteKey` | string | Yes | Site key from `data-sitekey` |
| `isInvisible` | boolean | No | `true` for invisible reCAPTCHA |
| `recaptchaDataSValue` | string | No | One-time token from `data-s` attribute |
| `cookies` | string | No | Format: `name1=val1; name2=val2` |
| `noCache` | boolean | No | Force fresh token generation |

## Response

| Field | Type | Description |
|-------|------|-------------|
| `gRecaptchaResponse` | string | Token to insert into `textarea#g-recaptcha-response` |
