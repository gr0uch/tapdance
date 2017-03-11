# Tapdance

A test harness that emits TAP, for JavaScript runtimes.

    "use strict"

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
    (defun run-test (fn)
      (defun assert (exp message)
        (incf *count*)
        (if exp
            (progn (incf *passing*)
                   (println (+ "ok " *count* " " message)))
          (println (+ "not ok " *count* " " message))))
      (defun comment (message) (println (+ "# " message)))
      ((@ *stack* push) (lambda () (fn assert comment))))

This is an implementation detail which runs all of the testing functions in
the order that they are declared.

    (defun flush ()
      ((@ ((@ *stack* reduce)
           (lambda (chain fn) ((@ ((@ chain then) fn) catch)
                               (lambda (error) (progn (incf *count*)
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
