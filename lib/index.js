/* eslint-disable no-process-exit */
import chalk from 'chalk'


const println = (s = '') =>
  process.stdout.write(`${s.replace('\n', '')}\n`)

let started = false
let bailing = false
let count = 0
let passing = 0


export function pass (message = 'unnamed assertion') {
  begin()
  count++
  passing++
  println(`ok ${count} ${message}`)
}


export function fail (message = 'unnamed assertion', error) {
  begin()
  count++
  println(`not ok ${count} ${message}`)
  if (error instanceof Error) {
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
  if (count === passing) comment(chalk.green(`All good!`))
  else comment(chalk.red(`${chalk.bold(count - passing)} failed ` +
    `(${Math.round(((count - passing) / (count || 1)) * 10000) / 100}%)`))
  println()
})


function begin () {
  if (started) return
  started = true
  println(`TAP version 13`)
}
