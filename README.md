<div align="center">

# node-capmonster

**Capmonster.cloud SDK for Node.js & TypeScript**

At least 2x cheaper, up to 30x faster than manual recognition services.

[![npm version](https://img.shields.io/npm/v/node-capmonster?style=flat-square&color=cb3837)](https://www.npmjs.com/package/node-capmonster)
[![npm downloads](https://img.shields.io/npm/dm/node-capmonster?style=flat-square)](https://www.npmjs.com/package/node-capmonster)
[![bundle size](https://img.shields.io/bundlephobia/minzip/node-capmonster?style=flat-square)](https://bundlephobia.com/package/node-capmonster)
[![license](https://img.shields.io/github/license/alperensert/node-capmonster?style=flat-square)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/alperensert/node-capmonster?style=flat-square)](https://github.com/alperensert/node-capmonster/stargazers)

[Documentation](https://alperensert.github.io/node-capmonster) &bull; [Report Bug](https://github.com/alperensert/node-capmonster/issues/new) &bull; [NPM Package](https://www.npmjs.com/package/node-capmonster)

</div>

---

## Installation

```bash
# bun (recommended)
bun add node-capmonster

# npm
npm install node-capmonster

# yarn
yarn add node-capmonster

# pnpm
pnpm add node-capmonster
```

## Supported Captcha Types

| Type | Class | Proxy Support |
|------|-------|:---:|
| reCAPTCHA v2 | `RecaptchaV2Task` | Optional |
| reCAPTCHA v2 Enterprise | `RecaptchaV2EnterpriseTask` | Optional |
| reCAPTCHA v3 | `RecaptchaV3Task` | Built-in |
| FunCaptcha (Arkose Labs) | `FuncaptchaTask` | Optional |
| GeeTest v3 | `GeeTestTask` | Optional |
| GeeTest v4 | `GeeTestV4Task` | Optional |
| Cloudflare Turnstile | `TurnstileTask` | Optional |
| Image to Text | `ImageToTextTask` | N/A |
| AWS WAF | `AmazonTask` | Optional |
| Binance | `BinanceTask` | Optional |
| DataDome | `DataDomeTask` | **Required** |
| Imperva (Incapsula) | `ImpervaTask` | **Required** |
| TenDI | `TenDITask` | Optional |
| Complex Image | `ComplexImageTask` | N/A |

## Quick Start

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

## Examples

<details>
<summary><strong>Turnstile with Cloudflare Challenge</strong></summary>

```ts
import { TurnstileTask } from "node-capmonster"

const client = new TurnstileTask("<api_key>")

client.setGlobalProxy({
    proxyType: "http",
    proxyAddress: "1.2.3.4",
    proxyPort: 8080,
    proxyLogin: "user",
    proxyPassword: "pass",
})

const ua = await client.getUserAgent()

const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "0x4AAA...",
    cloudflareTaskType: "cf_clearance",
    htmlPageBase64: "<base64_encoded_403_page>",
    userAgent: ua,
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.cf_clearance)
```

</details>

<details>
<summary><strong>FunCaptcha with blob data</strong></summary>

```ts
import { FuncaptchaTask } from "node-capmonster"

const client = new FuncaptchaTask("<api_key>")

const task = client.task({
    websiteURL: "https://example.com",
    websitePublicKey: "69A21A01-CC7B-B9C6-0F9A-E7FA06677FFC",
    data: '{"blob":"value_from_network_request"}',
    funcaptchaApiJSSubdomain: "client-api.arkoselabs.com",
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.token)
```

</details>

<details>
<summary><strong>Image to Text with recognition options</strong></summary>

```ts
import { ImageToTextTask } from "node-capmonster"
import path from "path"

const client = new ImageToTextTask("<api_key>")

const body = await client.prepareImageFromLocal(path.resolve("./captcha.png"))

const task = client.task({
    body,
    numeric: 1,
    recognizingThreshold: 90,
    CapMonsterModule: "amazon",
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.text)
```

</details>

<details>
<summary><strong>Error handling</strong></summary>

```ts
import { RecaptchaV2Task, CapmonsterError } from "node-capmonster"

const client = new RecaptchaV2Task("<api_key>")

try {
    const task = client.task({
        websiteURL: "https://example.com",
        websiteKey: "<site_key>",
    })
    const taskId = await client.createWithTask(task)
    const result = await client.joinTaskResult(taskId)

    console.log(result.gRecaptchaResponse)
} catch (err) {
    if (err instanceof CapmonsterError) {
        console.error(`${err.errorCode}: ${err.errorDescription}`)
    }
}
```

</details>

<details>
<summary><strong>Report incorrect solutions</strong></summary>

```ts
// Report incorrect image captcha
await client.reportIncorrectImageCaptcha(taskId)

// Report incorrect token captcha (reCAPTCHA, Turnstile, GeeTest, etc.)
await client.reportIncorrectTokenCaptcha(taskId)
```

</details>

For more examples and detailed API reference, see the [documentation](https://alperensert.github.io/node-capmonster).

## Support

> **Note:** Support is provided for the **code and library** only — not for captcha solving usage, integration strategies, or site-specific guidance.

- **Bug reports & feature requests:** [GitHub Issues](https://github.com/alperensert/node-capmonster/issues/new)
- **Contact:** [business@alperen.io](mailto:business@alperen.io)

## License

This project is licensed under the [MIT License](LICENSE).
