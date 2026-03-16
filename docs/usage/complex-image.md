---
label: Complex Image
icon: multi-select
order: 88
---

# Complex Image

Solve complex image-based captchas such as reCAPTCHA image grids and FunCaptcha images.

## Basic usage

```ts
import { ComplexImageTask } from "node-capmonster"

const client = new ComplexImageTask("<api_key>")

const task = client.task({
    class: "recaptcha",
    imageUrls: [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
    ],
    metadata: {
        Task: "Select all images with buses",
        Grid: "3x3",
    },
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.answer)
// [true, false, true, false, false, true, false, false, true]
```

## Request parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `class` | string | Yes | `"recaptcha"` or `"funcaptcha"` |
| `imageUrls` | string[] | One of | List of image URLs |
| `imagesBase64` | string[] | One of | List of base64-encoded images |
| `metadata.Task` | string | One of | Task description (in English) |
| `metadata.TaskDefinition` | string | One of | Technical task definition (reCAPTCHA only) |
| `metadata.Grid` | string | No | Grid size (e.g. `"3x3"`, `"4x4"`) |

!!!info
You must provide at least one of `imageUrls` or `imagesBase64`, and at least one of `metadata.Task` or `metadata.TaskDefinition`.
!!!

## Response

| Field | Type | Description |
|-------|------|-------------|
| `answer` | boolean[] | Array of booleans — `true` = click that image position |
