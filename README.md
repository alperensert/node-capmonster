# Capmonster.cloud for NodeJS

<center>

![GitHub release (release name instead of tag name)](https://img.shields.io/github/v/release/alperensert/node-capmonster?include_prereleases&style=for-the-badge) ![License](https://img.shields.io/github/license/alperensert/node-capmonster?style=for-the-badge) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/node-capmonster?style=for-the-badge) ![GitHub Repo stars](https://img.shields.io/github/stars/alperensert/node-capmonster?style=for-the-badge) ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/alperensert/node-capmonster/axios?style=for-the-badge)
![npm](https://img.shields.io/npm/dm/node-capmonster?style=for-the-badge)

</center>

_At least 2x cheaper, up to 30x faster than manual recognition services._

If you have any problem with usage, [read the documentation](https://node-capmonster.alperen.io) or [create an issue](https://github.com/alperensert/node-capmonster/issues/new)

## Installation

#### with yarn:

```bash
yarn add node-capmonster
```

#### with npm:

```bash
npm node-capmonster
```

#### with pnpm:

```bash
pnpm add node-capmonster
```

## Supported captcha types

-   FunCaptcha
-   GeeTest
-   HCaptcha
-   Image to Text
-   ReCAPTCHA v2 / v2 Enterprise / v3
-   Turnstile

## Usage examples

#### Recaptcha V2

```js
import { RecaptchaV2Task } from "node-capmonster"

const client = new RecaptchaV2Task("<api_key>")
const task = client.task({
    websiteKey: "<website_key>",
    websiteURL: "<url>",
})
const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
```

#### FuncaptchaTask

```js
import { FuncaptchaTask } from "node-capmonster"

const client = new FuncaptchaTask("<api_key>")
const task = client.task({
    websitePublicKey: "<website_pubkey>",
    websiteURL: "<url>",
})
const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
```

More examples can be found at [documentation](https://node-capmonster.alperen.io).
