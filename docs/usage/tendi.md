---
label: TenDI
icon: shield-lock
order: 89
---

# TenDI

Solve TenDI captcha challenges.

## Basic usage

```ts
import { TenDITask } from "node-capmonster"

const client = new TenDITask("<api_key>")

const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "<site_key>",
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.data)    // { randstr, ticket }
console.log(result.headers)
```

## With proxy

```ts
const client = new TenDITask("<api_key>")

client.setGlobalProxy({
    proxyType: "http",
    proxyAddress: "8.8.8.8",
    proxyPort: 8080,
})

const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "<site_key>",
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
```

## With error handling

```ts
import { TenDITask, CapmonsterError } from "node-capmonster"

const client = new TenDITask("<api_key>")

try {
    const task = client.task({
        websiteURL: "https://example.com",
        websiteKey: "<site_key>",
    })
    const taskId = await client.createWithTask(task)
    const result = await client.joinTaskResult(taskId)

    // Use the randstr and ticket in subsequent requests
    const { randstr, ticket } = result.data
    console.log(`randstr: ${randstr}, ticket: ${ticket}`)
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
| `websiteKey` | string | Yes | TenDI site key |
