# Tapdance

[![Build Status](https://img.shields.io/travis/0x8890/tapdance/master.svg?style=flat-square)](https://travis-ci.org/0x8890/tapdance)
[![npm Version](https://img.shields.io/npm/v/tapdance.svg?style=flat-square)](https://www.npmjs.com/package/tapdance)
[![License](https://img.shields.io/npm/l/tapdance.svg?style=flat-square)](https://raw.githubusercontent.com/0x8890/tapdance/master/LICENSE)

[TAP](https://testanything.org) emitter for writing tests with.

```
$ npm install tapdance
```


## Usage

```js
import { pass, fail, comment } from 'tapdance'
import assert from 'assert'

comment('assert using try/catch')
const message = 'trivial assert'
try {
  assert(true)
  pass(message)
}
catch (error) { fail(message) }

comment('function check')
pass(() => assert(true), 'works')
pass(() => assert(false), 'intentional fail')
fail(() => assert(false), 'should throw')
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

When the test exits, Tapdance will return a `0` exit code if nothing went wrong, and a non-zero exit code otherwise. There is no need to manually call when a test ends, except in the browser.


### tapdance.pass([fn], [message])

Create a passing message, optionally check if a function does **NOT** throw.


### tapdance.fail([fn], [message])

Create a failing message, optionally check if a function **SHOULD** throw.


### tapdance.comment([message])

Output a comment line.


### tapdance.run(fn)

Run a function. Calls to `run` get collected synchronously and run in sequential order in the next tick, which is useful when splitting up asynchronous tests in different files.


### tapdance.run.only(fn)

Same as `run`, but exclude other calls to `run`.


### tapdance.end([message])

End the test. This is not needed except when the process can not exit normally, such as in a browser environment. If a message is passed, it will bail out the test with the message and end the process with a non-zero exit code.


## License

This software is licensed under the [MIT License](//github.com/0x8890/tapdance/blob/master/LICENSE).
