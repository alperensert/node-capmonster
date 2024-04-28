---
title: AWS WAF
sidebar_position: 8
---

### How to get website key, context, iv and challengeScript parameters

When you go to a website, you get a 405 response and an html page with a captcha.
It is from this page that you can get all the parameters

![WAF1](/img/waf1.png)

![WAF2](/img/waf2.png)

## Prepare task

```js
import { AmazonTask } from "node-capmonster"

const client = new AmazonTask("<api_key>")
const task = client.task({
    websiteURL: "<url>",
    websiteKey: "<website-key>",
    challengeScript: "<challenge-script-url>",
    captchaScript: "<captcha-script-url>",
    context: "<context>",
    iv: "<iV>",
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
