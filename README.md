# Tapdance

[![Build Status](https://img.shields.io/travis/0x8890/tapdance/master.svg?style=flat-square)](https://travis-ci.org/0x8890/tapdance)
[![npm Version](https://img.shields.io/npm/v/tapdance.svg?style=flat-square)](https://www.npmjs.com/package/tapdance)
[![License](https://img.shields.io/npm/l/tapdance.svg?style=flat-square)](https://raw.githubusercontent.com/0x8890/tapdance/master/LICENSE)

Test harness that emits [TAP](https://testanything.org). Bring your own assertion library.

```
$ npm install tapdance
```


## Usage

```js
import { pass, fail, comment, run } from 'tapdance'
import assert from 'assert'

run(() => {
  comment('test')
  ok(true, 'trivial assert')
  ok(false, 'intentional fail')
  notOk(false, 'should throw')
})

function ok (expression, message) {
  pass(() => assert(expression), message)
}

function notOk (expression, message) {
  fail(() => assert(expression), message)
}
```

TAP output:

```
TAP version 13
# test
ok 1 trivial assert
not ok 2 intentional fail
  ---
  name: AssertionError
  message: false == true
  stack: <PLATFORM_STACK_TRACE>
  ...
ok 3 should throw
1..3

# 1 test failed
```

When the test exits, Tapdance will return a `0` exit code if nothing went wrong, and a non-zero exit code otherwise. There is no need to manually call when a test ends.


### tapdance.pass([fn], [message])

Create a passing message, optionally check if a function does **NOT** throw.


### tapdance.fail([fn], [message])

Create a failing message, optionally check if a function **SHOULD** throw.


### tapdance.comment([message])

Output a comment line.


### tapdance.run(fn)

Run a function which may return a Promise. Calls to `run` get collected synchronously and run in sequential order in the next tick, which is useful when splitting up asynchronous tests in different files.


### tapdance.run.only(fn)

Same as `run`, but exclude other calls to `run`.


## License

This software is licensed under the [MIT License](//github.com/0x8890/tapdance/blob/master/LICENSE).
