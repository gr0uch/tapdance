// Invariants to test for environment variables.
var hasProcess = typeof process !== 'undefined'
var hasExit = hasProcess && typeof process.exit === 'function'
var hasNextTick = hasProcess && typeof process.nextTick === 'function'

// These variables contain internal state.
var startTime = Date.now()
var stack = []
var hasStarted = false
var hasEnded = false
var count = 0
var passing = 0

var exportObject = {
  run: run,
  pass: pass,
  fail: fail,
  comment: comment,
  ok: ok,

  // Setting to allow concurrent tests, use this if you don't care about
  // the order in which the output comes back.
  isConcurrent: false,

  // Allow for custom Promise implementation, or to provide one in case of
  // an environment which does not implement Promise.
  Promise: typeof Promise !== 'undefined' ? Promise : null
}

// Run tests.
if (hasProcess) process.on('exit', exit)
if (hasNextTick) process.nextTick(flush)
else setTimeout(flush, 0)


function ok (value, message) {
  return value ? pass(message) : fail(message)
}


function pass (fn, message) {
  begin()
  count++

  if (typeof fn !== 'function') {
    passing++
    return outputOk(fn)
  }

  try {
    fn()
    passing++
    outputOk(message)
  }
  catch (error) {
    outputNotOk(message)
    showError(error)
  }
}


function fail (fn, message) {
  begin()
  count++

  if (typeof fn !== 'function') return outputNotOk(fn)

  try {
    fn()
    outputNotOk(message)
  }
  catch (error) {
    passing++
    outputOk(message)
  }
}


function comment (message) {
  if (message === void 0) message = 'empty comment'
  begin()
  println('# ' + message)
}


function run (fn) {
  stack.push(fn)
}

run.only = function runOnly (fn) {
  fn.only = true
  run(fn)
}


function hasOnly (fn) {
  return fn.only
}


// Flush calls to `run`.
function flush () {
  var Promise = exportObject.Promise
  var isConcurrent = exportObject.isConcurrent

  if (stack.some(hasOnly))
    stack = stack.filter(hasOnly)

  return (isConcurrent ?
    Promise.all(stack.map(function (fn) { return fn() }))
    : stack.reduce(function (chain, fn) {
      return chain.then(fn)
    }, Promise.resolve()))
  .then(end)
  .catch(function (error) {
    pass(function () { throw error }, error.message)
    end()
  })
}


function end () {
  if (hasExit) process.exit()
  else exit()
}


function exit (code) {
  if (hasEnded) return
  if (hasProcess) process.exitCode = code ?
    code : count && count === passing ? 0 : 1

  if (!count) fail('no tests found')
  else begin()

  println('1..' + count)
  println()
  if (count === passing) comment('all tests passed')
  else comment((count - passing) + ' test' +
    (count - passing > 1 ? 's' : '') + ' failed')
  comment('test finished in ' + ((Date.now() - startTime) / 1000) + ' s')
  println()

  hasEnded = true
}


function begin () {
  if (hasStarted || hasEnded) return
  hasStarted = true
  println('TAP version 13')
}


function outputOk (message) {
  if (message === void 0) message = 'unnamed assertion'
  println('ok ' + count + ' ' + message)
}


function outputNotOk (message) {
  if (message === void 0) message = 'unnamed assertion'
  println('not ok ' + count + ' ' + message)
}


function showError (error) {
  println('  ---')
  println('  name: ' + error.name)
  println('  message: ' + error.message)
  if (error.stack) {
    println('  stack:')
    error.stack.split('\n').forEach(function (line) {
      line = line.trim()
      if (line.indexOf(error.name) !== 0) println('    - ' + line)
    })
  }
  println('  ...')
}


function println (s) {
  console.log(s ? s.replace('\n', '') : '') // eslint-disable-line no-console
}


module.exports = exportObject
