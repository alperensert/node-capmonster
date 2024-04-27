---
title: Turnstile
sidebar_position: 5
---

:::warning

All Turnstile subtypes are automatically supported:
manual, non-interactive and invisible. Therefore, there is no need to specify a subtype.

:::

## What you need

-   Website key
-   Website url

## Prepare task

We get the site key, we already got the url. Lets create the task!

```js
import { TurnstileTask } from "node-capmonster"

const client = new TurnstileTask("<api_key>")
const task = client.task({
    websiteURL: "<url>",
    websiteKey: "<key>",
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

> In this case, `getTaskResult` function can be return null.
> You have to check the result before using.
> Or you can use `joinTaskResult` function.

#### with joinTaskResult

```javascript
// other codes..
const result = await client.joinTaskResult(taskId)
console.log(result.text)
```
