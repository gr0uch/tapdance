# Tapdance

[![Build Status](https://img.shields.io/travis/0x8890/tapdance/master.svg?style=flat-square)](https://travis-ci.org/0x8890/tapdance)
[![npm Version](https://img.shields.io/npm/v/tapdance.svg?style=flat-square)](https://www.npmjs.com/package/tapdance)
[![License](https://img.shields.io/npm/l/tapdance.svg?style=flat-square)](https://raw.githubusercontent.com/0x8890/tapdance/master/LICENSE)

Test harness that emits [TAP](https://testanything.org).

```
$ npm install tapdance
```


## Usage

```js
const t = require('tapdance')

t.run(() => {
  t.comment('test')
  t.ok(true, 'trivial assert')
  t.equal('apples', 'apples', 'the same value')
  t.deepEqual({ foo: 'bar' }, { foo: 'bar' },
    'deeply and strictly equal')
})
```

When the test exits, Tapdance will return a `0` exit code if nothing went wrong, and a non-zero exit code otherwise. There is no need to manually call when a test ends.


### t.ok(value, [message])

Check if a value is truthy or not.


### t.equal(a, b, [message])

Check if two values are strictly equal or not.


### t.deepEqual(a, b, [message])

Check if two values are deeply and strictly equal or not.


### t.pass([fn], [message])

Create a passing message, optionally check if a function does **NOT** throw.


### t.fail([fn], [message])

Create a failing message, optionally check if a function **SHOULD** throw.


### t.comment([message])

Output a comment line.


### t.run(fn)

Run a function which may return a Promise. Calls to `run` get collected synchronously and run in sequential order in the next tick, which is useful when splitting up asynchronous tests in different files.


### t.run.only(fn)

Same as `run`, but exclude other calls to `run`.


## License

This software is licensed under the [MIT License](//github.com/0x8890/tapdance/blob/master/LICENSE).
