---
label: Welcome
icon: home
order: 100
---

# node-capmonster

[Capmonster.cloud](https://capmonster.cloud) module for Node.js — at least 2x cheaper, up to 30x faster than manual recognition services.

---

## Supported captcha types

- [ReCaptcha v2](/usage/recaptcha-v2/)
- [ReCaptcha v2 Enterprise](/usage/recaptcha-v2-enterprise/)
- [ReCaptcha v3](/usage/recaptcha-v3/)
- [FunCaptcha](/usage/funcaptcha/)
- [GeeTest](/usage/geetest/)
- [Turnstile & Cloudflare Challenge](/usage/turnstile/)
- [Image to Text](/usage/image-to-text/)
- [AWS WAF](/usage/aws-waf/)
- [Binance](/usage/binance/)
- [Data Dome](/usage/data-dome/)
- [Imperva (Incapsula)](/usage/imperva/)
- [TenDI](/usage/tendi/)
- [Complex Image](/usage/complex-image/)

---

## Quick example

```ts
import { RecaptchaV2Task } from "node-capmonster"

const client = new RecaptchaV2Task("<api_key>")

const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "<site_key>",
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.gRecaptchaResponse)
```
