# Tapdance

JavaScript is insane by default, strict mode makes it less insane.

    "use strict"

Check if it's running in Node.js, this determines whether or not to call
Node.js specific APIs.

    (defvar *is-node*
     (and (not (eq (typeof process) 'undefined))
          (eq (typeof (@ process exit)) 'function)
          (eq (typeof (@ process next-tick)) 'function)))

Set up global state.

    (defvar *start-time* ((@ *date now)))
    (defvar *stack* (array))
    (defvar *count* 0)
    (defvar *passing* 0)
    (setf (@ module exports) run-test)

The test output starts here.

    (println "TAP version 13")
    (if *is-node*
        (progn ((@ process on) 'exit exit)
               ((@ process next-tick) flush))
      (set-timeout flush 0))

This is the main function, it accepts a test function that takes two
arguments, `assert` and `comment`.

    (defun run-test (fn)
      (defun assert (exp message)
        (incf *count*)
        (if exp
            (progn (incf *passing*)
                   (println (+ "ok " *count* " " message)))
          (println (+ "not ok " *count* " " message))))
      (defun comment (message) (println (+ "# " message)))
      ((@ *stack* push) (lambda () (fn assert comment))))

This is run internally on the next tick, which runs all of the testing
functions in order.

    (defun flush ()
      ((@ ((@ *stack* reduce)
       (lambda (chain fn) ((@ chain then) fn))
       ((@ *promise resolve))) then)
       (lambda () (if *is-node* ((@ process exit)) (exit)))
       (lambda (error) (show-error error))))

Upon exiting, print the results as well as some useful information such as
how many tests failed and how long it took.

    (defun exit (code)
      (if *is-node*
          (setf (@ process exit-code)
                (if code code
                  (if (and *count* (eq *count* *passing*)) 0 1))))
      (if (not *count*) (println "not ok 1 no tests found"))
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

Internal function to display errors that happen while running tests.

    (defun show-error (error)
      (println "  ---")
      (println (+ "  name: " (@ error name)))
      (println (+ "  message: " (@ error message)))
      (if (@ error stack)
          (progn
            (println "  stack:")
            ((@ ((@ error stack split) #\linefeed) for-each)
             (lambda (line)
               (setf line ((@ line trim)))
               (if (not (eq ((@ line index-of) (@ error name)) 0))
                   (println (+ "    - " line)))))))
      (println "  ..."))

Internal function to print lines while escaping new lines in the input.

    (defun println (str)
      ((@ console log)
       (if str ((@ str replace) #\linefeed "") "")))
