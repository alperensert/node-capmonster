---
title: Fun Captcha
sidebar_position: 7
---

## What you need

-   Website's public key
-   Website url

### From data-pkey attribute

Mostly, you can find the site key in a div, inside the `data-pkey` attribute.

```html title="index.html"
<div id="funcaptcha" data-pkey="<public_key_here>">...</div>
```

## Prepare task

We get the site key, we already got the url. Lets create the task!

```js
import { FuncaptchaTask } from "node-capmonster"

const client = new FuncaptchaTask("<api_key>")
const task = client.task({
    websitePublicKey: "<website_pubkey>",
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
