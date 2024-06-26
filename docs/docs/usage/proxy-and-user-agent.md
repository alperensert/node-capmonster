---
title: Proxy and User Agent
sidebar-position: 98
---

You can use proxy and user agent in supported tasks.

## Supported Tasks

-   ReCAPTCHA v2
-   Fun Captcha
-   HCaptcha
-   GeeTest
-   _more.._

:::info
For GeeTest and HCaptcha, proxies with IP authorization are not yet supported.
For others, if the proxy is authorized by IP, then be sure
to add **116.203.55.208** to the white list.
:::

## Proxy usage ReCaptcha V2

```js
import { RecaptchaV2Task } from "node-capmonster"

const client = new RecaptchaV2Task("<api_key>")
client.setGlobalProxy({
    proxyAddress: "127.0.0.1",
    proxyPort: 61,
    proxyLogin: "username",
    proxyPassword: "password",
    proxyType: "https",
})
```

## User agent with ReCaptcha V2

```js
import { RecaptchaV2Task } from "node-capmonster"

const client = new RecaptchaV2Task("<api_key>")
client.setGlobalUserAgent("<user_agent>")
```

:::tip
There is no difference between tasks for using
proxy or user agent. Can be done with the same way.
:::

:::danger
**If you set the proxy or user agent, the client will
use it until unset the values with `unsetProxy` or `unsetUserAgent` functions.**
:::
