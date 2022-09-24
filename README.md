Capmonster.cloud for NodeJS
=
![NodeJS Package Tests](https://github.com/alperensert/node-capmonster/actions/workflows/tests.yml/badge.svg?branch=master) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/node-capmonster) ![npm](https://img.shields.io/npm/dm/node-capmonster) ![NPM](https://img.shields.io/npm/l/node-capmonster) ![npm](https://img.shields.io/npm/v/node-capmonster) ![npm type definitions](https://img.shields.io/npm/types/node-capmonster) ![GitHub last commit](https://img.shields.io/github/last-commit/alperensert/node-capmonster) ![GitHub Repo stars](https://img.shields.io/github/stars/alperensert/node-capmonster?style=social)

NodeJS package for [Capmonster.cloud](https://capmonster.cloud)

If you have any problem with usage, [read the documentation](https://github.com/alperensert/node-capmonster/wiki) or [create an issue](https://github.com/alperensert/node-capmonster/issues/new)

*At least 2x cheaper, up to 30x faster than manual recognition services.*

### Installation
```
npm i node-capmonster
```

### Supported captcha types
- Image to text
- Recaptcha v2
- Recaptcha v3
- Fun Captcha
- HCaptcha
- GeeTest

Usage examples
-

#### ImageToText

```javascript
const { ImageToTextTask } = require("node-capmonster")

const capmonster = new ImageToTextTask("API_KEY")
capmonster.createTask("base64 encoded image as string")
    .then((taskId) => {
        captcha.joinTaskResult(taskId)
            .then((response) => console.log(response))
    })
```

#### Recaptcha v2

```javascript
const { RecaptchaV2Task } = require("node-capmonster")

const capmonster = new RecaptchaV2Task("API_KEY")
capmonster.createTask("website_url", "website_key")
    .then((taskId) => {
        capmonster.joinTaskResult(taskId)
            .then((response) => console.log(response))
    })
```

#### Recaptcha v2 enterprise

```javascript
const { RecaptchaV2EnterpriseTask } = require("node-capmonster")

const capmonster = new RecaptchaV2EnterpriseTask("API_KEY")
capmonster.createTask("website_url", "website_key", null, "payload", "api_domain", null)
    .then((taskId) => {
        capmonster.joinTaskResult(taskId)
            .then((response) => console.log(response))
    })
```

For other examples and api documentation please visit [wiki](https://github.com/alperensert/node-capmonster/wiki)