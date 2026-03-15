---
label: Complex Image
icon: multi-select
order: 88
---

# Complex Image

Solve complex image-based captchas such as reCAPTCHA image grids and FunCaptcha images.

## reCAPTCHA image grid with URLs

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

## reCAPTCHA with TaskDefinition

For more precise identification using technical task definitions:

```ts
const task = client.task({
    class: "recaptcha",
    imageUrls: ["https://example.com/grid.jpg"],
    metadata: {
        TaskDefinition: "/m/01bjv", // Vehicle definition from reCAPTCHA API
        Grid: "4x4",
    },
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
```

## FunCaptcha images with URLs

```ts
const task = client.task({
    class: "funcaptcha",
    imageUrls: [
        "https://example.com/funcaptcha-img1.jpg",
        "https://example.com/funcaptcha-img2.jpg",
    ],
    metadata: {
        Task: "Pick the image that is the correct way up",
    },
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.answer) // [false, true, false, ...]
```

## With base64 images from local files

```ts
import { ComplexImageTask } from "node-capmonster"
import path from "path"

const client = new ComplexImageTask("<api_key>")

const image1 = await client.prepareImageFromLocal(
    path.resolve("./grid-tile-1.png")
)
const image2 = await client.prepareImageFromLocal(
    path.resolve("./grid-tile-2.png")
)

const task = client.task({
    class: "recaptcha",
    imagesBase64: [image1, image2],
    metadata: {
        Task: "Select all images with traffic lights",
        Grid: "3x3",
    },
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
```

## With error handling

```ts
import { ComplexImageTask, CapmonsterError } from "node-capmonster"

const client = new ComplexImageTask("<api_key>")

try {
    const task = client.task({
        class: "recaptcha",
        imageUrls: ["https://example.com/captcha-grid.jpg"],
        metadata: {
            Task: "Select all images with crosswalks",
            Grid: "3x3",
        },
    })

    const taskId = await client.createWithTask(task)
    const result = await client.joinTaskResult(taskId)

    // Use the boolean array to determine which tiles to click
    result.answer.forEach((shouldClick, index) => {
        if (shouldClick) {
            console.log(`Click tile at position ${index}`)
        }
    })
} catch (err) {
    if (err instanceof CapmonsterError) {
        console.error(`Error: ${err.errorCode} - ${err.errorDescription}`)
    }
}
```

## Non-blocking polling

```ts
const taskId = await client.createWithTask(task)

const poll = setInterval(async () => {
    const result = await client.getTaskResult(taskId)
    if (result !== null) {
        clearInterval(poll)
        console.log("Answers:", result.answer)
    }
}, 3000)
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
