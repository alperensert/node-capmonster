---
label: Proxy & User Agent
icon: globe
order: 80
---

# Proxy & User Agent

Configure proxy and User-Agent for tasks that support them.

## Supported tasks

- ReCAPTCHA v2 / v2 Enterprise
- FunCaptcha
- GeeTest
- Turnstile
- AWS WAF
- Binance
- Data Dome (proxy **required**)
- Imperva (proxy **required**)

## Set a proxy

```ts
import { RecaptchaV2Task } from "node-capmonster"

const client = new RecaptchaV2Task("<api_key>")

client.setGlobalProxy({
    proxyType: "http",        // "http" | "https" | "socks4" | "socks5"
    proxyAddress: "1.2.3.4",
    proxyPort: 8080,
    proxyLogin: "username",   // optional
    proxyPassword: "password" // optional
})
```

!!!info
If the proxy is authorized by IP, whitelist **65.21.190.34**.
!!!

## Remove proxy

```ts
client.unsetProxy()
```

## Set User-Agent

```ts
client.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...")
```

## Remove User-Agent

```ts
client.unsetUserAgent()
```

## Get current User-Agent

Fetch the current valid Windows UA from CapMonster Cloud:

```ts
const ua = await client.getUserAgent()
client.setUserAgent(ua)
```

!!!danger
Proxy and User-Agent settings persist until explicitly unset with `unsetProxy()` or `unsetUserAgent()`. They apply to **all** tasks created by that client instance.
!!!
