import { comment, pass, fail, end, run } from '../lib'
import assert from 'assert'

run(() => {
  comment('assert')
  try {
    assert(true)
    pass('this works')
    assert(123)
    pass('this works too')
  }
  catch (error) {
    fail('something went wrong')
  }
})

run(() => {
  comment('function check')
  pass(() => assert(true), 'works')
  fail(() => assert(false), 'should throw')
})

run(end)
