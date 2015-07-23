/* eslint-disable no-process-exit */
const println = (s = '') =>
  process.stdout.write(`${s.replace('\n', '')}\n`)

let started = false
let bailing = false
let count = 0
let passing = 0


export function pass (fn, message) {
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
  begin()
  println(`# ${message}`)
}


export function bail (message = '') {
  begin()
  println(`Bail out! ${message}`)
  bailing = true
  process.exit(1)
}


process.on('exit', () => {
  if (bailing) return
  process.exitCode = count && count === passing ? 0 : 1
  begin()
  println(`1..${count}`)
  println()
  if (count === passing) comment(`All good!`)
  else comment(`${count - passing} ` +
    `test${count - passing > 1 ? 's' : ''} failed`)
  println()
})


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
    for (let line of error.stack.split('\n'))
      println(`    - ${line.trim()}`)
  }
  println(`  ...`)
}
