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
import * as t from 'tapdance'
import assert from 'assert'

t.comment('assert')
try {
  assert(true)
  t.pass('this works')
  assert(123)
  t.pass('this works too')
}
catch (error) {
  t.fail('something went wrong', error)
}

t.comment('function check')
t.check('works', () => assert(true))
t.check('intentional fail', () => assert(false))
t.check('should throw', () => assert(false), true)
```

TAP output:

```
TAP version 13
# assert
ok 1 this works
ok 2 this works too
# function check
ok 3 works
not ok 4 intentional fail
  ---
  name: AssertionError
  message: false == true
  stack: <PLATFORM_STACK_TRACE>
  ...
ok 5 should throw
1..5

# passed 4 (80%)
# failed 1 (20%)
```

On the process `exit` event, Tapdance will return a `0` exit code if nothing went wrong, and a non-zero exit code otherwise. There is no need to manually call when a test starts or ends.


## License

This software is licensed under the [MIT License](//github.com/0x8890/tapdance/blob/master/LICENSE).
