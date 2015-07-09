/* eslint-disable no-process-exit */
const write = (s = '') => process.stdout.write(`${s}\n`)
let started = false
let bailing = false
let count = 0
let passing = 0


export function pass (message = 'unnamed assertion') {
  begin()
  count++
  passing++
  write(`ok ${count} ${message.replace('\n', '')}`)
}


export function fail (message = 'unnamed assertion', error) {
  begin()
  count++
  write(`not ok ${count} ${message.replace('\n', '')}`)
  if (error instanceof Error) write(`  ---\n  ` +
    `name: ${error.name}\n  ` +
    `message: ${error.message}\n  ` +
    (error.stack ? `stack:\n${error.stack.split('\n')
    .map(s => `    - ${s.trim()}`).join('\n')}\n  ` : ``) +
    `...`)
}


export function check (message = 'unnamed assertion', fn, shouldThrow) {
  begin()
  try {
    fn()
    return shouldThrow ? this.fail(message) : this.pass(message)
  }
  catch (error) {
    return shouldThrow ? this.pass(message) : this.fail(message, error)
  }
}


export function comment (message = 'empty comment') {
  begin()
  write(`# ${message.replace('\n', '')}`)
}


export function bail (message = '') {
  begin()
  write(`Bail out! ${message.replace('\n', '')}`)
  bailing = true
  process.exit(1)
}


process.on('exit', () => {
  if (bailing) return
  process.exitCode = count && count === passing ? 0 : 1
  begin()
  write(`1..${count}\n`)
  comment(`passed ${passing} ` +
    `(${Math.round((passing / (count || 1)) * 10000) / 100}%)`)
  comment(`failed ${count - passing} ` +
    `(${Math.round(((count - passing) / (count || 1)) * 10000) / 100}%)`)
  write()
})


function begin () {
  if (started) return
  started = true
  write(`TAP version 13`)
}
