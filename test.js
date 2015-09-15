'use strict'

const tapdance = require('./')
const assert = require('assert')
const comment = tapdance.comment
const pass = tapdance.pass
const fail = tapdance.fail
const run = tapdance.run

run.only(() => {
  comment('assert')
  try {
    assert(true)
    pass('this works')
  }
  catch (error) {
    fail('something went wrong')
  }
})

run.only(() => {
  comment('function check')
  pass(() => assert(true), 'works')
  fail(() => assert(false), 'should throw')
})

run(() => fail('run.only doesn\'t work'))
