---
title: Image to Text
sidebar_position: 1
---

Before creating and sending a task request, you must convert your image to a base64-encoded string.
In this example, we assume you have a project structure like this:

```
src/
├── images/
│   └── captcha.png
└── index.js
package.json
```

## Prepare Image from Local

```javascript title="/src/index.js"
import { ImageToTextTask } from "node-capmonster"
import path from "path"

const client = new ImageToTextTask("<api_key>")
const imagePath = path.resolve(__dirname, "images", "captcha.png")
client.prepareImageFromLocal(imagePath).then((img) =>
    client
        .createWithTask({
            body: img,
        })
        .then((taskId) => console.log(taskId))
)
```

## Prepare Image from an External Link

```javascript title="/src/index.js"
import { ImageToTextTask } from "node-capmonster"

const client = new ImageToTextTask("<api_key>")
const imageLink = "https://example.com/assets/captcha.png"
client.prepareImageFromLink(imageLink).then((img) =>
    client
        .createWithTask({
            body: img,
        })
        .then((taskId) => console.log(taskId))
)
```

## Prepare Task

Prepare your task request. This feature allows you to avoid changing so many variables between tasks.

```javascript
import { ImageToTextTask } from "node-capmonster"

const client = new ImageToTextTask("<api_key>")
const task = client.task({
    body: convertedImage,
    recognizingThreshold: 80,
})
```

## Create Solving Request

```javascript
// other codes...
const taskId = await client.createWithTask(task)
```

### Get the Response

```javascript
// other codes...
const result = await client.getTaskResult(taskId) // get the result
if (result !== null) {
    // check the result
    console.log(result.text)
}
```

> Note: The `getTaskResult` function can return null.
> You must check the result before using it.
> Alternatively, you can use the `joinTaskResult` function.

#### with joinTaskResult

```javascript
// other codes...
const result = await client.joinTaskResult(taskId)
console.log(result.text)
```
