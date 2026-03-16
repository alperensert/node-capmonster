---
label: Image to Text
icon: image
order: 94
---

# Image to Text

Solve image-based text captchas via OCR.

## Basic usage

```ts
import { ImageToTextTask } from "node-capmonster"
import path from "path"

const client = new ImageToTextTask("<api_key>")

const body = await client.prepareImageFromLocal(
    path.resolve("./captcha.png")
)

const task = client.task({ body })
const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.text)
```

## Available modules

`amazon`, `apple`, `botdetect`, `facebook`, `gmx`, `google`, `hotmail`, `mailru`, `okeng`, `okrus`, `partiallyblur`, `ramblerrus`, `ramblerrusnew`, `solvemedia`, `steam`, `vk`, `whatsapp`, `wikimedia_paddle_ensemble`, `yandex`, `yandexnew`, `yandexwave`, `captcha_math`, `sat`, `universal`

## Request parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `body` | string | Yes | Base64-encoded image |
| `CapMonsterModule` | string | No | Recognition module name |
| `recognizingThreshold` | number | No | 0-100 min confidence |
| `Case` | boolean | No | Case-sensitive recognition |
| `numeric` | number | No | `1` = numbers only |
| `math` | boolean | No | Captcha requires arithmetic |

## Response

| Field | Type | Description |
|-------|------|-------------|
| `text` | string | Recognized text answer |
