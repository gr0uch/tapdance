'use strict'

const readline = require('readline')

const rl = readline.createInterface({ input: process.stdin })
let isBlock = false

rl.on('line', input => {
  if (!input.length) {
    if (!isBlock) isBlock = true
    else isBlock = false
    return
  }

  if (/^    /.test(input) && isBlock) console.log(input.trim())
  else isBlock = false
})
