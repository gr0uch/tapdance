# Tapdance

[![Build Status](https://img.shields.io/travis/daliwali/tapdance/master.svg?style=flat-square)](https://travis-ci.org/daliwali/tapdance)
[![npm Version](https://img.shields.io/npm/v/tapdance.svg?style=flat-square)](https://www.npmjs.com/package/tapdance)
[![License](https://img.shields.io/npm/l/tapdance.svg?style=flat-square)](https://raw.githubusercontent.com/daliwali/tapdance/master/LICENSE)

Test harness that emits the [Test Anything Protocol (TAP)](https://testanything.org). It runs in Node.js and web browsers, and is written in literate Parenscript (Common Lisp).

```
$ npm install tapdance
```


## Usage

When the test exits, Tapdance will return a `0` exit code if nothing went wrong, and a non-zero exit code otherwise. There is no need to manually call when a test ends.


### tapdance(fn)

Run a function which may return a Promise. Calls to `runTest` get collected synchronously and run in sequential order in the next tick, which is useful when splitting up asynchronous tests in different files. The `fn` accepts two arguments, `assert` and `comment`.


### assert(value, [message])

Check if a value is truthy or not.


### comment([message])

Output a comment line.


### runTest.assert

This can be overridden to use a different assert function.


## Building

You will need a Common Lisp implementation like [SBCL](http://www.sbcl.org), and `wget`. If installing the developer dependencies didn't work the first time, you may need to `cd node_modules/sigil-cli && make`.


## License

This software is licensed under the [MIT License](//github.com/daliwali/tapdance/blob/master/LICENSE).


## Code

Here's the full source code.

    "use strict"
    (defvar *assert* (require "assert"))

Check if it's running in Node.js, this determines whether or not to call
Node.js specific APIs.

    (defvar *is-node*
     (and (not (eq (typeof process) 'undefined))
          (eq (typeof (@ process exit)) 'function)
          (eq (typeof (@ process next-tick)) 'function)))

Initialize the local state of the program which is read & written later.

    (defvar *start-time* ((@ *date now)))
    (defvar *stack* (array))
    (defvar *count* 0)
    (defvar *passing* 0)

A bit a ceremony is needed to kick off the TAP output. This kicks off the
running of tests.

    (println "TAP version 13")
    (if *is-node*
        (progn ((@ process on) 'exit exit)
               ((@ process next-tick) flush))
      (set-timeout flush 0))

Define the main public function, it accepts a test function that takes two
arguments, `assert` and `comment`.

    (setf (@ module exports) run-test)
    (setf (@ run-test assert) *assert*)
    (defun run-test (fn)
      (defun assert (exp message)
        (incf *count*)
        (try
          (progn ((@ run-test assert) exp)
                 (incf *passing*)
                 (println (+ "ok " *count* " " message)))
          (:catch (error)
            (println (+ "not ok " *count* " " message))
            (show-error error))))
      (defun comment (message) (println (+ "# " message)))
      ((@ *stack* push) (lambda () (fn assert comment))))

This is an implementation detail which runs all of the testing functions in
the order that they are declared.

    (defun flush ()
      ((@ ((@ *stack* reduce)
           (lambda (chain fn)
             ((@ ((@ chain then) fn) catch)
              (lambda (error)
                (progn
                  (incf *count*)
                  (println (+ "not ok " *count* " " (@ error message)))
                  (show-error error)))))
           ((@ *promise resolve))) then)
       (lambda () (if *is-node* ((@ process exit)) (exit)))))

Upon exiting, print the results as well as some useful information such as
how many tests failed and how long it took.

    (defun exit ()
      (if *is-node*
          (setf (@ process exit-code)
                (if (and *count* (eq *count* *passing*)) 0 1)))
      (if (not *count*)
          (progn (incf *count*) (println "not ok 1 no tests found")))
      (println (+ "1.." *count*))
      (println)
      (if (eq *count* *passing*)
          (println "# all tests passed")
        (let ((failing (- *count* *passing*)))
          (println
           (+ "# " failing " test" (if (> failing 1) "s" "") " failed"))))
      (println
       (+ "# test finished in " (- ((@ *date now)) *start-time*) " ms"))
      (println))

Internal function to pretty print errors that happen while running tests.

    (defun show-error (error)
      (println "  ---")
      (println (+ "  name: " (@ error name)))
      (if ((@ (regex "\\n") test) (@ error message))
          (progn
            (println "  message:")
            ((@ ((@ error message split) #\linefeed) map)
             (lambda (line)
               (println (+ "    - " line)))))
        (progn
          (println (+ "  message: " (@ error message)))
          (if (@ error stack)
              (progn
                (println "  stack:")
                ((@ ((@ error stack split) #\linefeed) for-each)
                 (lambda (line)
                   (setf line ((@ line trim)))
                   (if (not (eq ((@ line index-of) (@ error name)) 0))
                       (println (+ "    - " line)))))))))
      (println "  ..."))

Internal function to print lines while escaping new lines in the input.

    (defun println (str)
      ((@ console log)
       (if str ((@ str replace) #\linefeed "") "")))
