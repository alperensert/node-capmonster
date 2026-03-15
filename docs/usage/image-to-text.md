---
label: Image to Text
icon: image
order: 94
---

# Image to Text

Solve image-based text captchas via OCR.

## From local file

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

## From URL

```ts
const client = new ImageToTextTask("<api_key>")

const body = await client.prepareImageFromLink(
    "https://example.com/captcha.png"
)

const task = client.task({ body })
const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.text)
```

## Numbers only with confidence threshold

```ts
const body = await client.prepareImageFromLocal(
    path.resolve("./numeric-captcha.png")
)

const task = client.task({
    body,
    numeric: 1,                // Numbers only
    recognizingThreshold: 90,  // Reject if confidence < 90%
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.text) // e.g. "381057"
```

## Math captcha

```ts
const body = await client.prepareImageFromLocal(
    path.resolve("./math-captcha.png")
)

const task = client.task({
    body,
    math: true, // Solve arithmetic (e.g. "12 + 5 = ?")
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.text) // e.g. "17"
```

!!!warning
Do **not** use `math: true` together with the `captcha_math` module — use one or the other.
!!!

## With specific recognition module

```ts
const task = client.task({
    body,
    CapMonsterModule: "amazon", // Use Amazon-specific recognition
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
```

## Case-sensitive captcha

```ts
const task = client.task({
    body,
    Case: true, // Preserve letter casing
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
```

## With error handling and reporting

```ts
import { ImageToTextTask, CapmonsterError } from "node-capmonster"

const client = new ImageToTextTask("<api_key>")

try {
    const body = await client.prepareImageFromLocal(
        path.resolve("./captcha.png")
    )
    const task = client.task({ body, recognizingThreshold: 80 })
    const taskId = await client.createWithTask(task)
    const result = await client.joinTaskResult(taskId)

    console.log(result.text)

    // If the answer was wrong, report it
    const accepted = await submitToSite(result.text)
    if (!accepted) {
        await client.reportIncorrectImageCaptcha(taskId)
    }
} catch (err) {
    if (err instanceof CapmonsterError) {
        console.error(`Error: ${err.errorCode}`)
    }
}
```

## Request parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `body` | string | Yes | Base64-encoded image |
| `CapMonsterModule` | string | No | Recognition module name |
| `recognizingThreshold` | number | No | 0-100 min confidence |
| `Case` | boolean | No | Case-sensitive recognition |
| `numeric` | number | No | `1` = numbers only |
| `math` | boolean | No | Captcha requires arithmetic |

## Available modules

`amazon`, `apple`, `botdetect`, `facebook`, `gmx`, `google`, `hotmail`, `mailru`, `okeng`, `okrus`, `partiallyblur`, `ramblerrus`, `ramblerrusnew`, `solvemedia`, `steam`, `vk`, `whatsapp`, `wikimedia_paddle_ensemble`, `yandex`, `yandexnew`, `yandexwave`, `captcha_math`, `sat`, `universal`

## Response

| Field | Type | Description |
|-------|------|-------------|
| `text` | string | Recognized text answer |
