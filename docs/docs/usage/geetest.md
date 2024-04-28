---
title: Gee Test
sidebar_position: 6
---

## What you need

-   GeeTest identifier key (a.k.a. _gt_)
-   Challenge key
-   Website url

### How can you get these?

-   The gt, challenge and geetestApiServerSubdomain parameters
    are most often found inside the initGeetest JavaScript function.
-   Also you can see in the HTML code of the page. You can find it in the
    script block, which appears after the page is fully loaded in the browser.

![How to get GeeTest needings](/img/geetest.png)

:::info
Keep in mind, the **gt** value is rarely updated.
But challenge value is always changing when everytime you see a GeeTest Captcha.
:::

## Prepare task

```js
import { GeeTestTask } from "node-capmonster"

const client = new GeeTestTask("<api_key>")
const task = client.task({
    gt: "<gt>",
    challenge: "<challenge",
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
