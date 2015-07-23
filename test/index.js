import { comment, pass, fail, end } from '../lib'
import assert from 'assert'

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

comment('function check')
pass(() => assert(true), 'works')
fail(() => assert(false), 'should throw')
end()
