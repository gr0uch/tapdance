# Tapdance

[![Build Status](https://img.shields.io/travis/0x8890/tapdance/master.svg?style=flat-square)](https://travis-ci.org/0x8890/tapdance)
[![npm Version](https://img.shields.io/npm/v/tapdance.svg?style=flat-square)](https://www.npmjs.com/package/tapdance)
[![License](https://img.shields.io/npm/l/tapdance.svg?style=flat-square)](https://raw.githubusercontent.com/0x8890/tapdance/master/LICENSE)

[TAP](https://testanything.org) emitter.

```
$ npm install tapdance
```


## Usage

```js
import { pass, fail, check, comment } from 'tapdance'
import assert from 'assert'

comment('assert using try/catch')
const message = 'trivial assert'
try {
  assert(true)
  pass(message)
}
catch (error) {
  fail(message, error)
}

comment('function check')
check('works', () => assert(true))
check('intentional fail', () => assert(false))
check('should throw', () => assert(false), true)
```

TAP output:

```
TAP version 13
# assert using try/catch
ok 1 trivial assert
# function check
ok 2 works
not ok 3 intentional fail
  ---
  name: AssertionError
  message: false == true
  stack: <PLATFORM_STACK_TRACE>
  ...
ok 4 should throw
1..4

# 1 test failed
```

On the process `exit` event, Tapdance will return a `0` exit code if nothing went wrong, and a non-zero exit code otherwise. There is no need to manually call when a test starts or ends.


## License

This software is licensed under the [MIT License](//github.com/0x8890/tapdance/blob/master/LICENSE).
