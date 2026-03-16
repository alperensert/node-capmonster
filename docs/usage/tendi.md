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

## Request parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `websiteURL` | string | Yes | Page URL |
| `websiteKey` | string | Yes | TenDI site key |
