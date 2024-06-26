---
title: ReCaptcha v3
sidebar_position: 4
---

## What you need

-   Website's key
-   Website url

### From the script element

Mostly, you can find the site key in `script` element, inside the `src` attribute.

```html
<script src="https://www.google.com/recaptcha/api.js?render=<THAT_ONE>" />
```

This javascript code can be provide you site key if it's in a `script` element.

```js
document.querySelector("script[src*='render=']").getAttribute("src")
```

:::tip
Paste above code to the browser console.
:::

## Prepare task

We get the site key, we already got the url. Lets create the task!

```js
import { RecaptchaV3Task } from "node-capmonster"

const client = new RecaptchaV3Task("<api_key>")
const task = client.task({
    websiteKey: "<website_key>",
    websiteURL: "<url>",
})
```

## Create solving request

```javascript
// other codes..
const taskId = await client.createWithTask(task)
```

### Get the response

```javascript
// other codes..
const result = await client.getTaskResult(taskId) // get the result
if (result !== null) {
    // check the result
    console.log(result.text)
}
```

:::warning
In this case, `getTaskResult` function can be return null.
You have to check the result before using.
Or you can use `joinTaskResult` function.
:::

#### with joinTaskResult

```javascript
// other codes..
const result = await client.joinTaskResult(taskId)
console.log(result.text)
```
