'use strict'

const hasProcess = typeof process !== 'undefined'
const hasExit = hasProcess && typeof process.exit === 'function'
const hasNextTick = hasProcess && typeof process.nextTick === 'function'
const end = () => hasExit ? process.exit() : exit()

let stack = []
let started = false
let ended = false
let bailing = false
let count = 0
let passing = 0


function pass (fn, message) {
  begin()
  count++

  if (typeof fn !== 'function') {
    passing++
    return ok(fn)
  }

  try {
    fn()
    passing++
    ok(message)
  }
  catch (error) {
    notOk(message)
    showError(error)
  }
}


function fail (fn, message) {
  begin()
  count++

  if (typeof fn !== 'function') return notOk(fn)

  try {
    fn()
    notOk(message)
  }
  catch (error) {
    passing++
    ok(message)
  }
}


function comment (message) {
  if (message === void 0) message = 'empty comment'
  begin()
  println(`# ${message}`)
}


function run (fn) {
  stack.push(fn)
}

run.only = fn => {
  fn.only = true
  run(fn)
}


// Flush calls to `run`.
function flush () {
  if (stack.some(fn => fn.only))
    stack = stack.filter(fn => fn.only)

  stack.reduce((chain, fn) =>
    chain.then(fn), Promise.resolve())
  .then(end)
  .catch(error => {
    pass(() => { throw error }, error.message)
    end()
  })
}


function exit (code) {
  if (bailing || ended) return
  if (hasProcess)
    process.exitCode = code ? code : count && count === passing ? 0 : 1

  begin()

  println(`1..${count}`)
  println()
  if (count === passing) comment(`All good!`)
  else comment(`${count - passing} ` +
    `test${count - passing > 1 ? 's' : ''} failed`)
  println()

  ended = true
}


function begin () {
  if (started || ended) return
  started = true
  println(`TAP version 13`)
}


function ok (message) {
  if (message === void 0) message = 'unnamed assertion'
  println(`ok ${count} ${message}`)
}


function notOk (message) {
  if (message === void 0) message = 'unnamed assertion'
  println(`not ok ${count} ${message}`)
}


function showError (error) {
  println(`  ---`)
  println(`  name: ${error.name}`)
  println(`  message: ${error.message}`)
  if (error.stack) {
    println(`  stack:`)
    for (let line of error.stack.split('\n').map(line => line.trim()))
      if (line.indexOf(error.name) !== 0) println(`    - ${line}`)
  }
  println(`  ...`)
}


function println (s) {
  console.log(s ? s.replace('\n', '') : '') // eslint-disable-line no-console
}


// Run tests.
if (hasProcess) process.on('exit', exit)
if (hasNextTick) process.nextTick(flush)
else setTimeout(flush, 0)

module.exports = { run, pass, fail, comment }