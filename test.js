var tapdance = require('./')
var assert = require('assert')
var comment = tapdance.comment
var pass = tapdance.pass
var fail = tapdance.fail
var run = tapdance.run

run.only(function () {
  comment('assert')
  try {
    assert(true)
    pass('this works')
  }
  catch (error) {
    fail('something went wrong')
  }
})

run.only(function () {
  comment('function check')
  pass(function () { assert(true) }, 'works')
  fail(function () { assert(false) }, 'should throw')
})

run(function () { fail('run.only doesn\'t work') })
