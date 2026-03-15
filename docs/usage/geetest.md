---
label: GeeTest
icon: verified
order: 96
---

# GeeTest

Solve GeeTest v3 and v4 captcha challenges.

!!!warning
For GeeTest v3, the `challenge` value **must be fresh** for each task. Using an expired challenge will result in `ERROR_TOKEN_EXPIRED` and you will still be charged.
!!!

---

## GeeTest v3

### Basic usage

```ts
import { GeeTestTask } from "node-capmonster"

const client = new GeeTestTask("<api_key>")

const task = client.task({
    websiteURL: "https://example.com",
    gt: "022397c99c9f646f6477822485f30404",
    challenge: "<fresh_challenge_value>",
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.challenge)
console.log(result.validate)
console.log(result.seccode)
```

### With proxy and API subdomain

```ts
const client = new GeeTestTask("<api_key>")

client.setGlobalProxy({
    proxyType: "http",
    proxyAddress: "8.8.8.8",
    proxyPort: 8080,
})

const task = client.task({
    websiteURL: "https://example.com",
    gt: "022397c99c9f646f6477822485f30404",
    challenge: "<fresh_challenge_value>",
    geetestApiServerSubdomain: "api-na.geetest.com",
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
```

### With error handling

```ts
import { GeeTestTask, CapmonsterError } from "node-capmonster"

const client = new GeeTestTask("<api_key>")

try {
    const task = client.task({
        websiteURL: "https://example.com",
        gt: "022397c99c9f646f6477822485f30404",
        challenge: "<fresh_challenge_value>",
    })
    const taskId = await client.createWithTask(task)
    const result = await client.joinTaskResult(taskId)

    // Submit the three tokens to the target site
    console.log({
        challenge: result.challenge,
        validate: result.validate,
        seccode: result.seccode
    })
} catch (err) {
    if (err instanceof CapmonsterError) {
        console.error(`Error: ${err.errorCode}`)
    }
}
```

### V3 request parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `websiteURL` | string | Yes | Page URL (use actual Referer URL) |
| `gt` | string | Yes | GeeTest identifier key |
| `challenge` | string | Yes | Dynamic key — must be fresh |
| `geetestApiServerSubdomain` | string | No | API subdomain if not `api.geetest.com` |
| `geetestGetLib` | string | No | Captcha script path (JSON string) |

### V3 response

| Field | Type | Description |
|-------|------|-------------|
| `challenge` | string | Challenge token |
| `validate` | string | Validate token |
| `seccode` | string | Seccode token |

---

## GeeTest v4

### Basic usage

```ts
import { GeeTestV4Task } from "node-capmonster"

const client = new GeeTestV4Task("<api_key>")

const task = client.task({
    websiteURL: "https://example.com",
    gt: "54088bb07d2df3c46b79f80300b0abbe",
    initParameters: { riskType: "slide" },
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.captcha_id)
console.log(result.lot_number)
console.log(result.pass_token)
console.log(result.gen_time)
console.log(result.captcha_output)
```

### With proxy

```ts
const client = new GeeTestV4Task("<api_key>")

client.setGlobalProxy({
    proxyType: "socks5",
    proxyAddress: "10.0.0.1",
    proxyPort: 1080,
})

const task = client.task({
    websiteURL: "https://example.com",
    gt: "54088bb07d2df3c46b79f80300b0abbe",
    initParameters: { riskType: "slide" },
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
```

### With error handling

```ts
import { GeeTestV4Task, CapmonsterError } from "node-capmonster"

const client = new GeeTestV4Task("<api_key>")

try {
    const task = client.task({
        websiteURL: "https://example.com",
        gt: "54088bb07d2df3c46b79f80300b0abbe",
        initParameters: { riskType: "slide" },
    })
    const taskId = await client.createWithTask(task)
    const result = await client.joinTaskResult(taskId)

    // Submit all five tokens to the target site
    console.log({
        captcha_id: result.captcha_id,
        lot_number: result.lot_number,
        pass_token: result.pass_token,
        gen_time: result.gen_time,
        captcha_output: result.captcha_output,
    })
} catch (err) {
    if (err instanceof CapmonsterError) {
        console.error(`Error: ${err.errorCode}`)
    }
}
```

### V4 request parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `websiteURL` | string | Yes | Page URL |
| `gt` | string | Yes | The `captcha_id` parameter |
| `initParameters` | object | Yes | Additional params with `riskType` |

### V4 response

| Field | Type | Description |
|-------|------|-------------|
| `captcha_id` | string | Captcha ID |
| `lot_number` | string | Lot number |
| `pass_token` | string | Pass token |
| `gen_time` | string | Generation time |
| `captcha_output` | string | Captcha output |
