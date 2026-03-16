---
label: Binance
icon: key
order: 92
---

# Binance

Solve Binance captcha challenges.

## Basic usage

```ts
import { BinanceTask } from "node-capmonster"

const client = new BinanceTask("<api_key>")

const task = client.task({
    websiteURL: "https://www.binance.com",
    websiteKey: "<bizId_value>",
    validateId: "<validate_id>",
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result)
```

## Request parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `websiteURL` | string | Yes | Page URL |
| `websiteKey` | string | Yes | The `bizId` value |
| `validateId` | string | Yes | Validate ID |
