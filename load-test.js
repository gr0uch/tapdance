require('espower-loader')({
  pattern: '*.js'
})

require('./').assert = require('power-assert')

require('./test')
