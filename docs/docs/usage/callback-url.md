---
title: Callback URL
sidebar_position: 99
---

## What is it?

Callback url is an option for sending task results to specified url.

Optional web address where we will send result of captcha task processing.
Contents are sent by `POST` request and are same to the contents of getTaskResult method.

:::warning
The content of the response is not checked and you must accept the request
in 2 seconds then the connection will be closed.
:::

## How to set

You can set the callback url with `setCallbackUrl` function, globally.

```js
import { RecaptchaV2Task } from "node-capmonster"

const client = new RecaptchaV2Task("<api_key>")
client.setCallbackUrl("<link>")
```

_\* All created tasks will created with callback url._

## How to unset

You can set the callback url with `unsetCallbackUrl` function.

```js
import { RecaptchaV2Task } from "node-capmonster"

const client = new RecaptchaV2Task("<api_key>")
client.setCallbackUrl("<link>")

// do some work

client.unsetCallbackUrl()
```
