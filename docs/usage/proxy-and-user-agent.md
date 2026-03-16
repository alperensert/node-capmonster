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
- GeeTest (v3 & v4)
- Turnstile
- AWS WAF
- Binance
- Data Dome (proxy **required**)
- Imperva (proxy **required**)
- MTCaptcha, Prosopo, Yidun, Altcha, Basilisk, Castle, Hunt, RecaptchaClick, TurnstileWaitroom, TSPD

## Per-task proxy

Pass proxy directly in the task configuration. This allows using different proxies for different tasks with the same client instance.

```ts
import { RecaptchaV2Task } from "node-capmonster"

const client = new RecaptchaV2Task("<api_key>")

const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "6Lcg7CMUAAAAANphynKgn9YAgA4tQ2KI_iqRyTwd",
    proxy: {
        proxyType: "http",        // "http" | "https" | "socks4" | "socks5"
        proxyAddress: "1.2.3.4",
        proxyPort: 8080,
    },
})

const taskId = await client.createWithTask(task)
const result = await client.joinTaskResult(taskId)
```

### With proxy authentication

```ts
const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "6Lcg7CMUAAAAANphynKgn9YAgA4tQ2KI_iqRyTwd",
    proxy: {
        proxyType: "http",
        proxyAddress: "1.2.3.4",
        proxyPort: 8080,
        proxyLogin: "username",     // optional
        proxyPassword: "password",  // optional
    },
})
```

### Different proxies per task

```ts
const client = new RecaptchaV2Task("<api_key>")

// Task 1 — HTTP proxy
const taskId1 = await client.createWithTask({
    websiteURL: "https://site-a.com",
    websiteKey: "key_a",
    proxy: {
        proxyType: "http",
        proxyAddress: "1.2.3.4",
        proxyPort: 8080,
    },
})

// Task 2 — SOCKS5 proxy
const taskId2 = await client.createWithTask({
    websiteURL: "https://site-b.com",
    websiteKey: "key_b",
    proxy: {
        proxyType: "socks5",
        proxyAddress: "5.6.7.8",
        proxyPort: 1080,
        proxyLogin: "user",
        proxyPassword: "pass",
    },
})
```

### Without proxy (Proxyless)

If you omit the `proxy` field, CapMonster Cloud uses built-in proxies:

```ts
const task = client.task({
    websiteURL: "https://example.com",
    websiteKey: "6Lcg7CMUAAAAANphynKgn9YAgA4tQ2KI_iqRyTwd",
})
```

### ProxyConfig type

You can import the `ProxyConfig` type for type-safe proxy configuration:

```ts
import { RecaptchaV2Task, ProxyConfig } from "node-capmonster"

const myProxy: ProxyConfig = {
    proxyType: "http",
    proxyAddress: "1.2.3.4",
    proxyPort: 8080,
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `proxyType` | string | Yes | `"http"`, `"https"`, `"socks4"`, `"socks5"` |
| `proxyAddress` | string | Yes | IPv4/IPv6 address (no hostnames) |
| `proxyPort` | number | Yes | Port number |
| `proxyLogin` | string | No | Username for proxy auth |
| `proxyPassword` | string | No | Password for proxy auth |

!!!info
If the proxy is authorized by IP, whitelist **65.21.190.34**.
!!!

---

## Global proxy (deprecated)

!!!warning
`setGlobalProxy` and `unsetProxy` are deprecated and will be removed in a future version. Use [per-task proxy](#per-task-proxy) instead.
!!!

The global proxy applies to **all** tasks created by that client instance. It is still functional but will emit a deprecation warning.

```ts
const client = new RecaptchaV2Task("<api_key>")

// Deprecated — use per-task proxy instead
client.setGlobalProxy({
    proxyType: "http",
    proxyAddress: "1.2.3.4",
    proxyPort: 8080,
})

// Remove global proxy
client.unsetProxy()
```

### Priority

When both per-task and global proxy are set, per-task proxy takes precedence:

1. **Per-task proxy** — if `proxy` is provided in the task config
2. **Global proxy** — if `setGlobalProxy` was called and no per-task proxy
3. **Proxyless** — if neither is set (uses CapMonster Cloud built-in proxies)

---

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
User-Agent settings persist until explicitly unset with `unsetUserAgent()`. They apply to **all** tasks created by that client instance.
!!!
