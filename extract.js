'use strict'

var indent = /^    /

require('readline')
.createInterface({ input: process.stdin })
.on('line', input => indent.test(input) ?
  process.stdout.write(`${input.replace(indent, '')}\n`) : null)
