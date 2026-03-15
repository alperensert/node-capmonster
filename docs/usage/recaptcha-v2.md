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

## Invisible reCAPTCHA

```ts
const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "6Lcg7CMUAAAAANphynKgn9YAgA4tQ2KI_iqRyTwd",
    isInvisible: true,
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
```

## With proxy

```ts
const client = new RecaptchaV2Task("<api_key>")

client.setGlobalProxy({
    proxyType: "http",
    proxyAddress: "8.8.8.8",
    proxyPort: 8080,
    proxyLogin: "user",
    proxyPassword: "pass",
})

const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "6Lcg7CMUAAAAANphynKgn9YAgA4tQ2KI_iqRyTwd",
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
```

## With cookies and data-s value

```ts
const client = new RecaptchaV2Task("<api_key>")

const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "6Lcg7CMUAAAAANphynKgn9YAgA4tQ2KI_iqRyTwd",
    cookies: client.convertCookies({
        session: "abc123",
        token: "xyz789",
    }),
    recaptchaDataSValue: "<fresh_data_s_value>",
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
```

## Non-blocking polling

Use `getTaskResult` for manual polling instead of `joinTaskResult`:

```ts
const taskId = await client.createWithTask(task)

// Poll manually every 3 seconds
const poll = setInterval(async () => {
    const result = await client.getTaskResult(taskId)
    if (result !== null) {
        clearInterval(poll)
        console.log(result.gRecaptchaResponse)
    }
}, 3000)
```

## With error handling

```ts
import { RecaptchaV2Task, CapmonsterError } from "node-capmonster"

const client = new RecaptchaV2Task("<api_key>")

try {
    const task = client.task({
        websiteURL: "https://example.com",
        websiteKey: "6Lcg7CMUAAAAANphynKgn9YAgA4tQ2KI_iqRyTwd",
    })
    const taskId = await client.createWithTask(task)
    const result = await client.joinTaskResult(taskId)

    console.log(result.gRecaptchaResponse)
} catch (err) {
    if (err instanceof CapmonsterError) {
        console.error(`API Error: ${err.errorCode} - ${err.errorDescription}`)
    } else {
        throw err
    }
}
```

## With nocache

Force a fresh token when the site rejects cached ones:

```ts
const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "6Lcg7CMUAAAAANphynKgn9YAgA4tQ2KI_iqRyTwd",
    noCache: true,
})
```

## Report incorrect solution

```ts
const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

// If the site rejects the token
await client.reportIncorrectTokenCaptcha(taskId)
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
