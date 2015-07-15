import { comment, pass, fail, check } from '../lib'
import assert from 'assert'

comment('assert')
try {
  assert(true)
  pass('this works')
  assert(123)
  pass('this works too')
}
catch (error) {
  fail('something went wrong', error)
}

comment('function check')
check('works', () => assert(true))
check('should throw', () => assert(false), true)
