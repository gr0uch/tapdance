import { comment, pass, fail, end, run } from '../lib'
import assert from 'assert'

run.only(() => {
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

run.only(() => {
  comment('function check')
  pass(() => assert(true), 'works')
  fail(() => assert(false), 'should throw')
})

run(() => fail('run.only doesn\'t work'))

run.only(() => end())
