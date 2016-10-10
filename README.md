# Tapdance

[![Build Status](https://img.shields.io/travis/sapeien/tapdance/master.svg?style=flat-square)](https://travis-ci.org/sapeien/tapdance)
[![npm Version](https://img.shields.io/npm/v/tapdance.svg?style=flat-square)](https://www.npmjs.com/package/tapdance)
[![License](https://img.shields.io/npm/l/tapdance.svg?style=flat-square)](https://raw.githubusercontent.com/sapeien/tapdance/master/LICENSE)

Test harness that emits the [Test Anything Protocol (TAP)](https://testanything.org). It runs in Node.js and web browsers, and is written in literate Parenscript (Common Lisp).

```
$ npm install tapdance
```


## Usage

```js
const runTest = require('tapdance')

runTest((assert, comment) => {
  comment('sync test')
  assert(true, 'trivial assert')
  assert('apples' !== 'oranges', 'different value')

  return new Promise(resolve => {
    comment('async test')
    doSomethingAsync().then(result => {
      assert(result, 'result exists')
      resolve()
    })
  })
})
```

When the test exits, Tapdance will return a `0` exit code if nothing went wrong, and a non-zero exit code otherwise. There is no need to manually call when a test ends.


### runTest(fn)

Run a function which may return a Promise. Calls to `runTest` get collected synchronously and run in sequential order in the next tick, which is useful when splitting up asynchronous tests in different files. The `fn` accepts two arguments, `assert` and `comment`.


### assert(value, [message])

Check if a value is truthy or not.


### comment([message])

Output a comment line.


## Building

You will need a Common Lisp implementation like [SBCL](http://www.sbcl.org), and `wget`. If installing the developer dependencies didn't work the first time, you may need to `cd node_modules/sigil-cli && make`.


## License

This software is licensed under the [MIT License](//github.com/sapeien/tapdance/blob/master/LICENSE).
