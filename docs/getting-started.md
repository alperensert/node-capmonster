---
label: Getting Started
icon: zap
order: 90
---

# Getting Started

## Installation

+++ bun
```bash
bun add node-capmonster
```
+++ npm
```bash
npm install node-capmonster
```
+++ yarn
```bash
yarn add node-capmonster
```
+++ pnpm
```bash
pnpm add node-capmonster
```
+++

## Basic usage

Every captcha type follows the same pattern:

1. Create a client with your API key
2. Build a task configuration
3. Submit the task
4. Wait for the result

```ts
import { RecaptchaV2Task } from "node-capmonster"

// 1. Create client
const client = new RecaptchaV2Task("<your_api_key>")

// 2. Build task
const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "<site_key>",
})

// 3. Submit task
const taskId = await client.createWithTask(task)

// 4. Wait for result
const result = await client.joinTaskResult(taskId)
```

## Check balance

All task classes inherit from `CapmonsterClient`, which provides the `getBalance` method:

```ts
const balance = await client.getBalance()
console.log(`Balance: $${balance}`)
```

## Report incorrect solutions

If a solution was incorrect, you can report it:

```ts
// For image captchas
await client.reportIncorrectImageCaptcha(taskId)

// For token captchas (reCAPTCHA, GeeTest, Turnstile, etc.)
await client.reportIncorrectTokenCaptcha(taskId)
```

## Get current User-Agent

Some captcha types require a valid browser User-Agent. You can fetch the current one from CapMonster Cloud:

```ts
const userAgent = await client.getUserAgent()
```

## Configure timeout

Set the maximum time (in seconds) to wait for a solution:

```ts
client.setTimeout(60) // 60 seconds (must be between 1 and 300)
```

## Next steps

Choose a captcha type from the [Usage](/usage/) section to see detailed examples.
