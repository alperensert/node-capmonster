---
title: ReCaptcha v2 Enterprise
sidebar_position: 3
---

## What you need

-   Website's captcha key
-   Website url

### From g-recaptcha div

Mostly, you can find the site key in `g-recaptcha` div, inside the `data-sitekey` attribute.

```html
<div class="g-recaptcha" data-sitekey="<sitekey_here>">...</div>
```

This javascript code can be provide you site key if it's in `data-sitekey` attribute.

```js
const siteKey = document
    .getElementsByClassName("g-recaptcha")[0]
    .getAttribute("data-sitekey")
console.log(siteKey)
```

:::tip
Paste above code to the browser console.
:::

### From iframe source

If the g-recaptcha div isn't work in your case, you can try this
javascript code for extracting site key from `<iframe>`.

```js
new URLSearchParams(
    document
        .querySelector("iframe[src*='google.com/recaptcha/api2']")
        .getAttribute("src")
).get("k")
```

:::tip
Paste above code to the browser console.
:::

## Prepare task

We get the site key, we already got the url. Lets create the task!

```js
import { RecaptchaV2EnterpriseTask } from "node-capmonster"

const client = new RecaptchaV2EnterpriseTask("<api_key>")
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
In this case, **getTaskResult** function can be return null.
You have to check the result before using.
Or you can use **joinTaskResult** function.
:::

#### with joinTaskResult

```javascript
// other codes..
const result = await client.joinTaskResult(taskId)
console.log(result.text)
```
