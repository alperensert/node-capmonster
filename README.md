## Capmonster.cloud for NodeJS
![npm](https://img.shields.io/npm/v/node-capmonster) ![NPM](https://img.shields.io/npm/l/node-capmonster) ![npm](https://img.shields.io/npm/dw/node-capmonster) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/node-capmonster)

Unofficial Capmonster.cloud module for NodeJS. \
Currently supporting ImageToText, NoCaptcha (Recaptcha v2) proxyless and proxy-on, Recaptchav3Proxyless, FunCaptcha proxyless and proxy-on.

**At least 2x cheaper, up to 30x faster than manual recognition services.**
```
npm install node-capmonster
```
### Documentation
Will be added.

### Examples

##### *ImageToTextTask*
- Send image without encode.
```javascript
const { ImageToTextTask } = require("node-capmonster")

const imgcaptcha = new ImageToTextTask("CLIENT-KEY")

imgcaptcha.createTask("IMAGE-PATH")
    .then((taskId) => {
        return taskId
    })
    .then((taskId) => {
        imgcaptcha.joinTaskResult(taskId)
            .then((response) => {console.info(response)})
    })
```

- Send directly image encoded data.
```javascript
const { ImageToTextTask } = require("node-capmonster")

const imgcaptcha = new ImageToTextTask("CLIENT-KEY")

imgcaptcha.createTask(null, base64_encoded_image)
    .then((taskId) => {
        return taskId
    })
    .then((taskId) => {
        imgcaptcha.joinTaskResult(taskId)
            .then((response) => {console.info(response)})
    })
```

##### *NoCaptchaTaskProxyless*

```javascript
const { NoCaptchaTaskProxyless } = require("node-capmonster")

const recaptcha = new NoCaptchaTaskProxyless("CLIENT-KEY")
recaptcha.createTask("WEBSITE-RECAPTCHAV2-KEY", "WEBSITE-URL")
.then((taskId) => {
    console.info(taskId);
    return taskId
}).then((taskId) => {
    return taskId;
}).then((taskId) => {
    recaptcha.joinTaskResult(taskId)
        .then((response) => {console.info(response)})
})
```

##### *NoCaptchaTask*

```javascript
const { NoCaptchaTask } = require("node-capmonster")

const recaptcha = new NoCaptchaTask("CLIENT-KEY")
recaptcha.createTask("WEBSITE-RECAPTCHAV2-KEY",
                    "WEBSITE-URL",
                    "proxyAddress",
                    "proxyPort",
                    "proxyLogin",
                    "proxyPassword",
                    "proxyType")
    .then((taskId) => {
        console.info(taskId);
        return taskId
    }).then((taskId) => {
    return taskId;
}).then((taskId) => {
    recaptcha.joinTaskResult(taskId)
        .then((response) => {console.info(response)})
})
```

##### *RecaptchaV3TaskProxyless*
> Default minimum score is 0.3 and default page action is "verify"

```javascript
const { RecaptchaV3TaskProxyless } = require("node-capmonster")

const recaptchav3 = new RecaptchaV3TaskProxyless("CLIENT-KEY")
recaptchav3.createTask("WEBSITE-RECAPTCHAV3-KEY",
                    "WEBSITE-URL",
                    "minimum_score",
                    "page_action")
    .then((taskId) => {
        console.info(taskId);
        return taskId
    }).then((taskId) => {
    return taskId;
}).then((taskId) => {
    recaptcha.joinTaskResult(taskId)
        .then((response) => {console.info(response)})
})
```

##### *FunCaptchaTaskProxyless*
> default js_subdomain and data_blob are both null.

```javascript
const { FunCaptchaTaskProxyless } = require("node-capmonster")

const funcaptcha = new FunCaptchaTaskProxyless("CLIENT-KEY")
funcaptcha.createTask("WEBSITE-PUBLIC-KEY", "WEBSITE-URL")
    .then((taskId) => {
        console.info(taskId);
        return taskId
    }).then((taskId) => {
    return taskId;
}).then((taskId) => {
    recaptcha.joinTaskResult(taskId)
        .then((response) => {console.info(response)})
})
```

##### *FunCaptchaTaskProxyless*
> default js_subdomain and data_blob are both null.

```javascript
const { FunCaptchaTask } = require("node-capmonster")

const funcaptcha = new FunCaptchaTask("CLIENT-KEY")
funcaptcha.createTask("WEBSITE-PUBLIC-KEY", 
                    "WEBSITE-URL",
                    "proxyAddress",
                    "proxyPort",
                    "proxyLogin",
                    "proxyPassword",
                    "proxyType")
    .then((taskId) => {
        console.info(taskId);
        return taskId
    }).then((taskId) => {
    return taskId;
}).then((taskId) => {
    recaptcha.joinTaskResult(taskId)
        .then((response) => {console.info(response)})
})
```

###### Things to add:
- Cookie support for NoCaptchaTask proxy-on and proxyless.