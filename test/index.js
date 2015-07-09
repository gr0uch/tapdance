import * as t from '../lib'
import assert from 'assert'

t.comment('assert')
try {
  assert(true)
  t.pass('this works')
  assert(123)
  t.pass('this works too')
}
catch (error) {
  t.fail('something went wrong', error)
}

t.comment('function check')
t.check('works', () => assert(true))
t.check('should throw', () => assert(false), false)
