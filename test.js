var t = require('./')
var assert = require('assert')

t.isConcurrent = true

t.run.only(function () {
  t.comment('assert')
  try {
    assert(true)
    t.pass('this works')
  }
  catch (error) {
    t.fail('something went wrong')
  }
})

t.run.only(function () {
  t.comment('function check')
  t.pass(function () { assert(true) }, 'works')
  t.fail(function () { assert(false) }, 'should throw')
})

t.run.only(function () {
  t.comment('assert helpers')
  t.ok(true)
})

t.run(function () { t.fail('run.only doesn\'t work') })
