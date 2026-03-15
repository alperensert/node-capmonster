---
label: Callback URL
icon: bell
order: 79
---

# Callback URL

Instead of polling for results, you can receive a POST callback when a task completes.

## Set callback URL

```ts
import { RecaptchaV2Task } from "node-capmonster"

const client = new RecaptchaV2Task("<api_key>")

client.setCallbackUrl("https://your-server.com/captcha-callback")
```

The callback payload is identical to the `getTaskResult` response. Your server must accept the request and respond within **2 seconds**.

## Remove callback URL

```ts
client.unsetCallbackUrl()
```

!!!info
The callback URL applies to **all** tasks created after it is set. Call `unsetCallbackUrl()` to stop receiving callbacks.
!!!
