# Changelog

## [1.0.0](https://github.com/alperensert/node-capmonster/compare/node-capmonster-v0.4.5...node-capmonster-v1.0.0) (2026-03-16)


### ⚠ BREAKING CHANGES

* createTask method is no longer available on any task class. Use task() + createWithTask() instead.
* setGlobalProxy and unsetProxy now emit deprecation warnings. Remove deprecated createTask methods from all task classes.
* HCaptchaTask export has been removed.

### Features

* add 11 new captcha task types ([d5687d7](https://github.com/alperensert/node-capmonster/commit/d5687d7376d796409abf49b88640b8268802e848))
* add BinanceTask and ImpervaTask ([001ac72](https://github.com/alperensert/node-capmonster/commit/001ac72c39d021cd7ce8a7e444865d3ce178b484))
* add per-task proxy support, deprecate global proxy ([9132bb3](https://github.com/alperensert/node-capmonster/commit/9132bb3f3fadb1850bd86fdfcf157903755283f3))
* add reportIncorrectCaptcha and getUserAgent API methods ([5ffcf3b](https://github.com/alperensert/node-capmonster/commit/5ffcf3b11954b2b4ffdf5d57c6d95a37859ee5dc))
* remove deprecated createTask methods for v1.0.0 ([de510d2](https://github.com/alperensert/node-capmonster/commit/de510d247865feb624dfc50bbe737da552c99722))
* remove HCaptchaTask support ([8bf02fb](https://github.com/alperensert/node-capmonster/commit/8bf02fb53c95095cd006041c2482a123ea71d503))
* update task types to match current CapMonster Cloud API ([5f4a90e](https://github.com/alperensert/node-capmonster/commit/5f4a90e42b3921ebd8de957f29c9cd983b9ecec5))


### Bug Fixes

* **ci:** use retypeapp/action-github-pages for docs deployment ([594d85d](https://github.com/alperensert/node-capmonster/commit/594d85d4b78931e4b2b91819b96081302ab2f21c))
* correct RecaptchaV3 score boundary and DataDome metadata ([2fbb6aa](https://github.com/alperensert/node-capmonster/commit/2fbb6aa04c958c740634691665802779953ddcff))


### Miscellaneous Chores

* release 1.0.0 ([6d2002d](https://github.com/alperensert/node-capmonster/commit/6d2002d22dd9423c557b052966a5a1f936b5d7b5))

## [0.4.5](https://github.com/alperensert/node-capmonster/compare/node-capmonster-v0.4.4...node-capmonster-v0.4.5) (2024-04-28)


### Features

* added data dome task class for handling Data Dome captchas ([5e340f3](https://github.com/alperensert/node-capmonster/commit/5e340f33e68649608b6015290b33b32c1078fad5))
* added geetest v4 task support ([0332067](https://github.com/alperensert/node-capmonster/commit/0332067c64671b91e8b2a76b9c3946470017c981))


### Bug Fixes

* export aws waf task from root of the package ([da4822f](https://github.com/alperensert/node-capmonster/commit/da4822f0e1150decacec03c2ec3519694b7a82f8))

## [0.4.4](https://github.com/alperensert/node-capmonster/compare/node-capmonster-v0.4.3...node-capmonster-v0.4.4) (2024-04-27)


### Features

* aws waf task support ([c663c4a](https://github.com/alperensert/node-capmonster/commit/c663c4ae6f535479c7f48dc4fa7832b83edfe725))

## [0.4.3](https://github.com/alperensert/node-capmonster/compare/node-capmonster-v0.4.2...node-capmonster-v0.4.3) (2024-04-17)


### Features

* added TenDI task ([6236065](https://github.com/alperensert/node-capmonster/commit/6236065223b7c2eed797c79d93e6707b24bb0244))
* complex image task added ([da039c6](https://github.com/alperensert/node-capmonster/commit/da039c627eadaaa7f88547ba1443cbd48aed136f))


### Bug Fixes

* gatsby docs lock file ([7fa84c0](https://github.com/alperensert/node-capmonster/commit/7fa84c0c3142cc50f7ac3d61899512f686616e4e))
* gatsby-config & test workflow ([26d2154](https://github.com/alperensert/node-capmonster/commit/26d21543a1ef8d181ca4cd46ad600b41fe107924))
