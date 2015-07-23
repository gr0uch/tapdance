const hasProcess = typeof process !== 'undefined'
let started = false
let ended = false
let bailing = false
let count = 0
let passing = 0


export function pass (fn, message) {
  if (ended) return null
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


export function fail (fn, message) {
  if (ended) return null
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


export function comment (message = 'empty comment') {
  if (ended) return
  begin()
  println(`# ${message}`)
}


export function bail (message = '') {
  if (ended) return
  begin()
  println(`Bail out! ${message}`)
  bailing = true
  process.exit(1)
}


export function end () {
  if (ended) return
  begin()
  exit()
}


if (hasProcess) process.on('exit', exit)


function exit () {
  if (bailing || ended) return
  if (hasProcess) process.exitCode = count && count === passing ? 0 : 1

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
  if (started) return
  started = true
  println(`TAP version 13`)
}


function ok (message = 'unnamed assertion') {
  println(`ok ${count} ${message}`)
}


function notOk (message = 'unnamed assertion') {
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

function println (s = '') {
  console.log(s.replace('\n', ''))
}
