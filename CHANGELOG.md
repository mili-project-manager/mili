# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.3.1"></a>
## [1.3.1](https://github.com/Val-istar-Guo/vue-boilerplate/compare/v1.3.0...v1.3.1) (2018-10-30)


### Bug Fixes

* add 'exist' to enum of  valid upgrade type ([37385f4](https://github.com/Val-istar-Guo/vue-boilerplate/commit/37385f4))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/Val-istar-Guo/vue-boilerplate/compare/v1.2.1...v1.3.0) (2018-10-29)


### Bug Fixes

* **encoding:** encoding for binary file ([a50482c](https://github.com/Val-istar-Guo/vue-boilerplate/commit/a50482c))


### Features

* add new upgrade type 'exist' ([4df7db6](https://github.com/Val-istar-Guo/vue-boilerplate/commit/4df7db6)), closes [#27](https://github.com/Val-istar-Guo/vue-boilerplate/issues/27)



<a name="1.2.1"></a>
## [1.2.1](https://github.com/Val-istar-Guo/vue-boilerplate/compare/v1.2.0...v1.2.1) (2018-10-26)


### Bug Fixes

* **clone:** cannot get includes of undefined ([ab72b32](https://github.com/Val-istar-Guo/vue-boilerplate/commit/ab72b32))
* **merge:** missing a comma ([b12d955](https://github.com/Val-istar-Guo/vue-boilerplate/commit/b12d955))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/Val-istar-Guo/vue-boilerplate/compare/v1.1.4...v1.2.0) (2018-10-25)


### Bug Fixes

* **clone:** version order error ([c9ee866](https://github.com/Val-istar-Guo/vue-boilerplate/commit/c9ee866))
* **handler:** unable to recognize functional handler ([6b0000a](https://github.com/Val-istar-Guo/vue-boilerplate/commit/6b0000a))


### Features

* **handler:** new handler to get content area from project file ([217267a](https://github.com/Val-istar-Guo/vue-boilerplate/commit/217267a)), closes [#22](https://github.com/Val-istar-Guo/vue-boilerplate/issues/22)



<a name="1.1.4"></a>
## [1.1.4](https://github.com/Val-istar-Guo/vue-boilerplate/compare/v1.1.3...v1.1.4) (2018-10-25)


### Bug Fixes

* **copy:** commentator.extnames is undefined ([28570d1](https://github.com/Val-istar-Guo/vue-boilerplate/commit/28570d1)), closes [#24](https://github.com/Val-istar-Guo/vue-boilerplate/issues/24)



<a name="1.1.3"></a>
## [1.1.3](https://github.com/Val-istar-Guo/vue-boilerplate/compare/v1.1.2...v1.1.3) (2018-10-23)


### Bug Fixes

* **copy:** comments affect the mrkdown file function ([2e14ec6](https://github.com/Val-istar-Guo/vue-boilerplate/commit/2e14ec6))



<a name="1.1.2"></a>
## [1.1.2](https://github.com/Val-istar-Guo/vue-boilerplate/compare/v1.1.1...v1.1.2) (2018-10-21)


### Bug Fixes

* template config sanitization is not effective ([fcc0e79](https://github.com/Val-istar-Guo/vue-boilerplate/commit/fcc0e79))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/Val-istar-Guo/vue-boilerplate/compare/v1.1.0...v1.1.1) (2018-10-21)


### Bug Fixes

* compatible with the case where the repository field is a string ([d28a3e4](https://github.com/Val-istar-Guo/vue-boilerplate/commit/d28a3e4))
* git link parse error ([2528e96](https://github.com/Val-istar-Guo/vue-boilerplate/commit/2528e96))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/Val-istar-Guo/vue-boilerplate/compare/v1.0.1...v1.1.0) (2018-10-21)


### Bug Fixes

* **merge:** file merge handler unusable ([a24b479](https://github.com/Val-istar-Guo/vue-boilerplate/commit/a24b479)), closes [#19](https://github.com/Val-istar-Guo/vue-boilerplate/issues/19)


### Features

* add a comment indicating the upgrade type of file ([18d2cbd](https://github.com/Val-istar-Guo/vue-boilerplate/commit/18d2cbd)), closes [#15](https://github.com/Val-istar-Guo/vue-boilerplate/issues/15)
* add update command ([01b8fed](https://github.com/Val-istar-Guo/vue-boilerplate/commit/01b8fed)), closes [#16](https://github.com/Val-istar-Guo/vue-boilerplate/issues/16)



<a name="1.0.1"></a>
## [1.0.1](https://github.com/Val-istar-Guo/vue-boilerplate/compare/v1.0.0...v1.0.1) (2018-10-18)


### Bug Fixes

* missing mustache module ([e7a0d9d](https://github.com/Val-istar-Guo/vue-boilerplate/commit/e7a0d9d)), closes [#14](https://github.com/Val-istar-Guo/vue-boilerplate/issues/14)



<a name="1.0.0"></a>
# [1.0.0](https://github.com/Val-istar-Guo/vue-boilerplate/compare/v0.1.0...v1.0.0) (2018-10-17)


### Code Refactoring

* separate the template from the scaffold ([6de2212](https://github.com/Val-istar-Guo/vue-boilerplate/commit/6de2212)), closes [#7](https://github.com/Val-istar-Guo/vue-boilerplate/issues/7)


### Features

* **template:** constraint version number and change log ([5500f8c](https://github.com/Val-istar-Guo/vue-boilerplate/commit/5500f8c))


### BREAKING CHANGES

* The option `-t` of `mili init` command is no long supported. And each template will
become a independent project. If you want to upgrade the template, you need to manually configure
.milirc, then run mili upgrade.



<a name="0.1.0"></a>
# [0.1.0](https://github.com/Val-istar-Guo/vue-boilerplate/compare/v0.0.9...v0.1.0) (2018-10-03)


### Features

* **template:** push after publish ([031347d](https://github.com/Val-istar-Guo/vue-boilerplate/commit/031347d))



<a name="0.0.9"></a>
## [0.0.9](https://github.com/Val-istar-Guo/vue-boilerplate/compare/v0.0.8...v0.0.9) (2018-10-03)



<a name="0.0.8"></a>
## [0.0.8](https://github.com/Val-istar-Guo/vue-boilerplate/compare/v0.0.7...v0.0.8) (2018-10-03)


### Bug Fixes

* **command:** project upgrade did not get the community profile feature ([06e3cf3](https://github.com/Val-istar-Guo/vue-boilerplate/commit/06e3cf3))



<a name="0.0.7"></a>
## [0.0.7](https://github.com/Val-istar-Guo/vue-boilerplate/compare/v0.0.5...v0.0.7) (2018-10-03)


### Features

* **commit:** add commit message specification ([fbea6d2](https://github.com/Val-istar-Guo/vue-boilerplate/commit/fbea6d2))
* **template:** add commit message specification ([dcdacd4](https://github.com/Val-istar-Guo/vue-boilerplate/commit/dcdacd4)), closes [#6](https://github.com/Val-istar-Guo/vue-boilerplate/issues/6)
* **template:** husky upgrade to ^1.0.1 ([fc447c0](https://github.com/Val-istar-Guo/vue-boilerplate/commit/fc447c0))
* **template:** support github community profile ([96e6f08](https://github.com/Val-istar-Guo/vue-boilerplate/commit/96e6f08)), closes [#11](https://github.com/Val-istar-Guo/vue-boilerplate/issues/11)
* **upgrade:** upgrade will overwrite .czrc and .commitlintrc.yml ([e179ba6](https://github.com/Val-istar-Guo/vue-boilerplate/commit/e179ba6))
* **upgrade:** upgrade will overwrite .huskyrc.yml ([17db781](https://github.com/Val-istar-Guo/vue-boilerplate/commit/17db781))


### BREAKING CHANGES

* **upgrade:** .czrc and .commitlintrc.yml will be override when upgrade mili
* **upgrade:** .huskyrc.yml will be override when upgrade mili
* **template:** husky hooks in "scripts" will no longer work



<a name="0.0.6"></a>
## [0.0.6](https://github.com/Val-istar-Guo/vue-boilerplate/compare/v0.0.5...v0.0.6) (2018-10-02)


### Features

* **commit:** add commit message specification ([fbea6d2](https://github.com/Val-istar-Guo/vue-boilerplate/commit/fbea6d2))
* **template:** add commit message specification ([dcdacd4](https://github.com/Val-istar-Guo/vue-boilerplate/commit/dcdacd4)), closes [#6](https://github.com/Val-istar-Guo/vue-boilerplate/issues/6)
* **template:** husky upgrade to ^1.0.1 ([fc447c0](https://github.com/Val-istar-Guo/vue-boilerplate/commit/fc447c0))


### BREAKING CHANGES

* **template:** husky hooks in "scripts" will no longer work