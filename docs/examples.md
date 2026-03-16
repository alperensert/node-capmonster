---
label: Examples
icon: code
order: 75
---

# Examples

Advanced usage examples for all supported captcha types. For basic usage and parameter reference, see the individual [Usage](/usage/) pages.

---

## Proxy

### Per-task proxy

```ts
import { RecaptchaV2Task } from "node-capmonster"

const client = new RecaptchaV2Task("<api_key>")

const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "6Lcg7CMUAAAAANphynKgn9YAgA4tQ2KI_iqRyTwd",
    proxy: {
        proxyType: "http",
        proxyAddress: "8.8.8.8",
        proxyPort: 8080,
        proxyLogin: "user",      // optional
        proxyPassword: "pass",   // optional
    },
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
```

### Different proxies per task

```ts
const client = new RecaptchaV2Task("<api_key>")

const taskId1 = await client.createWithTask({
    websiteURL: "https://site-a.com",
    websiteKey: "key_a",
    proxy: { proxyType: "http", proxyAddress: "1.2.3.4", proxyPort: 8080 },
})

const taskId2 = await client.createWithTask({
    websiteURL: "https://site-b.com",
    websiteKey: "key_b",
    proxy: { proxyType: "socks5", proxyAddress: "5.6.7.8", proxyPort: 1080 },
})
```

---

## Error handling

```ts
import { RecaptchaV2Task, CapmonsterError } from "node-capmonster"

const client = new RecaptchaV2Task("<api_key>")

try {
    const task = client.task({
        websiteURL: "https://example.com",
        websiteKey: "6Lcg7CMUAAAAANphynKgn9YAgA4tQ2KI_iqRyTwd",
    })
    const taskId = await client.createWithTask(task)
    const result = await client.joinTaskResult(taskId)

    console.log(result.gRecaptchaResponse)
} catch (err) {
    if (err instanceof CapmonsterError) {
        console.error(`API Error: ${err.errorCode} - ${err.errorDescription}`)
    } else {
        throw err
    }
}
```

---

## Report incorrect solution

```ts
const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

// Token captchas (reCAPTCHA, GeeTest, Turnstile)
await client.reportIncorrectTokenCaptcha(taskId)

// Image captchas (ImageToText)
await client.reportIncorrectImageCaptcha(taskId)
```

---

## Non-blocking polling

Use `getTaskResult` for manual polling instead of `joinTaskResult`:

```ts
const taskId = await client.createWithTask(task)

const poll = setInterval(async () => {
    const result = await client.getTaskResult(taskId)
    if (result !== null) {
        clearInterval(poll)
        console.log(result)
    }
}, 3000)
```

---

## Custom timeout

```ts
const client = new RecaptchaV2Task("<api_key>")

// Set global timeout (1-300 seconds)
client.setTimeout(60)

// Or pass timeout per call
const result = await client.joinTaskResult(taskId, 90)
```

---

## ReCaptcha v2

### Invisible reCAPTCHA

```ts
import { RecaptchaV2Task } from "node-capmonster"

const client = new RecaptchaV2Task("<api_key>")

const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "6Lcg7CMUAAAAANphynKgn9YAgA4tQ2KI_iqRyTwd",
    isInvisible: true,
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
```

### With cookies and data-s value

```ts
const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "6Lcg7CMUAAAAANphynKgn9YAgA4tQ2KI_iqRyTwd",
    cookies: client.convertCookies({
        session: "abc123",
        token: "xyz789",
    }),
    recaptchaDataSValue: "<fresh_data_s_value>",
})
```

### With nocache

Force a fresh token when the site rejects cached ones:

```ts
const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "6Lcg7CMUAAAAANphynKgn9YAgA4tQ2KI_iqRyTwd",
    noCache: true,
})
```

---

## ReCaptcha v2 Enterprise

### With enterprise parameters

```ts
import { RecaptchaV2EnterpriseTask } from "node-capmonster"

const client = new RecaptchaV2EnterpriseTask("<api_key>")

const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "6Lcg7CMUAAAAANphynKgn9YAgA4tQ2KI_iqRyTwd",
    enterprisePayload: '{"s": "SOME_ADDITIONAL_TOKEN"}',
    apiDomain: "www.recaptcha.net",
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
```

### With cookies

```ts
const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "6Lcg7CMUAAAAANphynKgn9YAgA4tQ2KI_iqRyTwd",
    cookies: client.convertCookies({ session: "abc123" }),
    proxy: {
        proxyType: "http",
        proxyAddress: "1.2.3.4",
        proxyPort: 8080,
    },
})
```

---

## ReCaptcha v3

### With score and action

```ts
import { RecaptchaV3Task } from "node-capmonster"

const client = new RecaptchaV3Task("<api_key>")

const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "6Le-wvkSVAAAExE_szVSP2n",
    minScore: 0.3,
    pageAction: "myverify",
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
```

### Enterprise mode

```ts
const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "6Le-wvkSVAAAExE_szVSP2n",
    minScore: 0.9,
    isEnterprise: true,
})
```

### With nocache

```ts
const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "6Le-wvkSVAAAExE_szVSP2n",
    noCache: true,
})
```

---

## FunCaptcha

### With blob data and subdomain

```ts
import { FuncaptchaTask } from "node-capmonster"

const client = new FuncaptchaTask("<api_key>")

const task = client.task({
    websiteURL: "https://example.com",
    websitePublicKey: "<public_key>",
    funcaptchaApiJSSubdomain: "client-api.arkoselabs.com",
    data: '{"blob": "blob_value_here"}',
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
```

!!!warning
Do **NOT** load the captcha iframe to extract the `blob` value — this invalidates it. Obtain it from network requests instead.
!!!

### With proxy and cookies

```ts
const task = client.task({
    websiteURL: "https://example.com",
    websitePublicKey: "<public_key>",
    cookies: client.convertCookies({ session: "abc" }),
    proxy: {
        proxyType: "http",
        proxyAddress: "1.2.3.4",
        proxyPort: 8080,
    },
})
```

---

## GeeTest

### v3 with proxy and API subdomain

```ts
import { GeeTestTask } from "node-capmonster"

const client = new GeeTestTask("<api_key>")

const task = client.task({
    websiteURL: "https://example.com",
    gt: "<gt_key>",
    challenge: "<fresh_challenge>",
    geetestApiServerSubdomain: "api-na.geetest.com",
    proxy: {
        proxyType: "http",
        proxyAddress: "1.2.3.4",
        proxyPort: 8080,
    },
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.challenge, result.validate, result.seccode)
```

!!!warning
The `challenge` value must be **fresh** — expired challenges result in `ERROR_TOKEN_EXPIRED` and you will still be charged.
!!!

### v4 with proxy

```ts
import { GeeTestV4Task } from "node-capmonster"

const client = new GeeTestV4Task("<api_key>")

const task = client.task({
    websiteURL: "https://example.com",
    gt: "<captcha_id>",
    initParameters: { riskType: "slide" },
    proxy: {
        proxyType: "socks5",
        proxyAddress: "10.0.0.1",
        proxyPort: 1080,
    },
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.captcha_id, result.lot_number, result.pass_token)
```

---

## Turnstile

### With action and cData

```ts
import { TurnstileTask } from "node-capmonster"

const client = new TurnstileTask("<api_key>")

const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "0x4AAAAAAADnPIDROrmt1Wwj",
    pageAction: "login",
    data: "<cData_value>",
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
```

### Cloudflare Challenge (token)

```ts
const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "0x4AAAAAAADnPIDROrmt1Wwj",
    cloudflareTaskType: "token",
    pageAction: "managed",
    data: "<cData_value>",
    pageData: "<chlPageData_value>",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...",
    proxy: {
        proxyType: "http",
        proxyAddress: "1.2.3.4",
        proxyPort: 8080,
    },
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.token)
```

### Cloudflare Challenge (cf_clearance)

Proxy is **required** for cf_clearance mode.

```ts
const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "any_string",
    cloudflareTaskType: "cf_clearance",
    htmlPageBase64: Buffer.from(html403Page).toString("base64"),
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...",
    proxy: {
        proxyType: "http",
        proxyAddress: "1.2.3.4",
        proxyPort: 8080,
        proxyLogin: "user",      // optional
        proxyPassword: "pass",   // optional
    },
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.cf_clearance)
```

---

## Image to Text

### From URL

```ts
import { ImageToTextTask } from "node-capmonster"

const client = new ImageToTextTask("<api_key>")

const body = await client.prepareImageFromLink("https://example.com/captcha.png")

const task = client.task({ body })
const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.text)
```

### Numbers only with confidence threshold

```ts
const task = client.task({
    body: imageBase64,
    numeric: 1,
    recognizingThreshold: 80,
})
```

### Math captcha

```ts
const task = client.task({
    body: imageBase64,
    math: true,
})
```

!!!warning
Do not use `math: true` together with the `captcha_math` module — they are mutually exclusive.
!!!

### With recognition module

```ts
const task = client.task({
    body: imageBase64,
    CapMonsterModule: "google",
})
```

### Case-sensitive

```ts
const task = client.task({
    body: imageBase64,
    Case: true,
})
```

---

## AWS WAF

### Voucher solution (without cookies)

```ts
import { AmazonTask } from "node-capmonster"

const client = new AmazonTask("<api_key>")

const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "<aws_waf_key>",
    captchaScript: "https://example.com/captcha.js",
    cookieSolution: false,
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.captcha_voucher, result.existing_token)
```

### Challenge mode

```ts
const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "<aws_waf_key>",
    captchaScript: "https://example.com/captcha.js",
    challengeScript: "https://example.com/challenge.js",
    context: "<context_value>",
    iv: "<iv_value>",
    cookieSolution: true,
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.cookies)
```

### With proxy

```ts
const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "<aws_waf_key>",
    captchaScript: "https://example.com/captcha.js",
    cookieSolution: true,
    proxy: {
        proxyType: "http",
        proxyAddress: "1.2.3.4",
        proxyPort: 8080,
    },
})
```

---

## Binance

### With proxy

```ts
import { BinanceTask } from "node-capmonster"

const client = new BinanceTask("<api_key>")

const task = client.task({
    websiteURL: "https://accounts.binance.com",
    websiteKey: "<bizId>",
    validateId: "<validate_id>",
    proxy: {
        proxyType: "http",
        proxyAddress: "1.2.3.4",
        proxyPort: 8080,
    },
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
```

---

## Data Dome

### Full workflow

```ts
import { DataDomeTask, CapmonsterError } from "node-capmonster"

const client = new DataDomeTask("<api_key>")

try {
    // 1. Fetch the target page — get the 403 response and datadome cookie
    const pageHtml = "<html>...</html>"
    const htmlBase64 = Buffer.from(pageHtml).toString("base64")
    const datadomeCookie = "datadome=abc123xyz..."
    const captchaUrl = "https://geo.captcha-delivery.com/captcha/?initialCid=..."

    // 2. Create the task
    const task = client.task({
        websiteURL: "https://example.com",
        metadata: {
            htmlPageBase64: htmlBase64,
            captchaUrl,
            datadomeCookie,
        },
        proxy: {
            proxyType: "http",
            proxyAddress: "1.2.3.4",
            proxyPort: 8080,
            proxyLogin: "user",      // optional
            proxyPassword: "pass",   // optional
        },
    })

    const taskId = await client.createWithTask(task)
    const result = await client.joinTaskResult(taskId)

    // 3. Extract the new cookies from the solution
    console.log(result.domains)
} catch (err) {
    if (err instanceof CapmonsterError) {
        console.error(`Error: ${err.errorCode} - ${err.errorDescription}`)
    }
}
```

---

## Imperva

### Full workflow

```ts
import { ImpervaTask, CapmonsterError } from "node-capmonster"

const client = new ImpervaTask("<api_key>")

try {
    // 1. Extract the required values from the protected page
    const incapsulaScriptUrl = "https://protected-site.com/_Incapsula_Resource?SWJIYLWA=..."
    const incapsulaCookies = "visid_incap=abc; incap_ses_874=xyz; nlbi_874=def"
    const reese84UrlEndpoint = "https://protected-site.com/a3fE8dK"

    // 2. Create the task
    const task = client.task({
        websiteURL: "https://protected-site.com",
        metadata: {
            incapsulaScriptUrl,
            incapsulaCookies,
            reese84UrlEndpoint,
        },
        proxy: {
            proxyType: "http",
            proxyAddress: "1.2.3.4",
            proxyPort: 8080,
            proxyLogin: "user",      // optional
            proxyPassword: "pass",   // optional
        },
    })

    const taskId = await client.createWithTask(task)
    const result = await client.joinTaskResult(taskId)

    // 3. Extract and use the new cookies
    console.log(result.domains)
} catch (err) {
    if (err instanceof CapmonsterError) {
        console.error(`Error: ${err.errorCode} - ${err.errorDescription}`)
    }
}
```

---

## Complex Image

### reCAPTCHA with TaskDefinition

```ts
import { ComplexImageTask } from "node-capmonster"

const client = new ComplexImageTask("<api_key>")

const task = client.task({
    class: "recaptcha",
    imageUrls: [
        "https://example.com/img1.png",
        "https://example.com/img2.png",
    ],
    metadata: {
        TaskDefinition: "/m/0k4j",
    },
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)

console.log(result.answer) // [true, false]
```

### FunCaptcha images

```ts
const task = client.task({
    class: "funcaptcha",
    imageUrls: ["https://example.com/funcaptcha_img.png"],
    metadata: {
        Task: "Pick the image that is the correct way up",
    },
})
```

### With base64 images from local files

```ts
const img1 = await client.prepareImageFromLocal("/path/to/image1.png")
const img2 = await client.prepareImageFromLocal("/path/to/image2.png")

const task = client.task({
    class: "recaptcha",
    imagesBase64: [img1, img2],
    metadata: {
        Task: "Select all images with traffic lights",
    },
})
```
