/* use strict */
'use strict';
/* (DEFVAR *IS-NODE*
     (AND (NOT (EQ (TYPEOF PROCESS) 'UNDEFINED))
          (EQ (TYPEOF (@ PROCESS EXIT)) 'FUNCTION)
          (EQ (TYPEOF (@ PROCESS NEXT-TICK)) 'FUNCTION))) */
var ISNODE = typeof process !== 'undefined' && typeof process.exit === 'function' && typeof process.nextTick === 'function';
/* (DEFVAR *START-TIME* ((@ *DATE NOW))) */
var STARTTIME = Date.now();
/* (DEFVAR *STACK* (ARRAY)) */
var STACK = [];
/* (DEFVAR *COUNT* 0) */
var COUNT = 0;
/* (DEFVAR *PASSING* 0) */
var PASSING = 0;
/* (SETF (@ MODULE EXPORTS) RUN-TEST) */
module.exports = runTest;
/* (PRINTLN TAP version 13) */
println('TAP version 13');
/* (IF *IS-NODE*
       (PROGN ((@ PROCESS ON) 'EXIT EXIT) ((@ PROCESS NEXT-TICK) FLUSH))
       (SET-TIMEOUT FLUSH 0)) */
if (ISNODE) {
    process.on('exit', exit);
    process.nextTick(flush);
} else {
    setTimeout(flush, 0);
};
/* (DEFUN RUN-TEST (FN)
     (DEFUN ASSERT (EXP MESSAGE)
       (INCF *COUNT*)
       (IF EXP
           (PROGN (INCF *PASSING*) (PRINTLN (+ ok  *COUNT*   MESSAGE)))
           (PRINTLN (+ not ok  *COUNT*   MESSAGE))))
     (DEFUN COMMENT (MESSAGE) (PRINTLN (+ #  MESSAGE)))
     ((@ *STACK* PUSH) (LAMBDA () (FN ASSERT COMMENT)))) */
function runTest(fn) {
    function assert(exp, message) {
        ++COUNT;
        if (exp) {
            ++PASSING;
            return println('ok ' + COUNT + ' ' + message);
        } else {
            return println('not ok ' + COUNT + ' ' + message);
        };
    };
    function comment(message) {
        return println('# ' + message);
    };
    return STACK.push(function () {
        return fn(assert, comment);
    });
};
/* (DEFUN FLUSH ()
     ((@
       ((@ *STACK* REDUCE) (LAMBDA (CHAIN FN) ((@ CHAIN THEN) FN))
        ((@ *PROMISE RESOLVE)))
       THEN)
      (LAMBDA ()
        (IF *IS-NODE*
            ((@ PROCESS EXIT))
            (EXIT)))
      (LAMBDA (ERROR) (SHOW-ERROR ERROR)))) */
function flush() {
    return STACK.reduce(function (chain, fn) {
        return chain.then(fn);
    }, Promise.resolve()).then(function () {
        return ISNODE ? process.exit() : exit();
    }, function (error) {
        return showError(error);
    });
};
/* (DEFUN EXIT ()
     (IF *IS-NODE*
         (SETF (@ PROCESS EXIT-CODE)
                 (IF (AND *COUNT* (EQ *COUNT* *PASSING*))
                     0
                     1)))
     (IF (NOT *COUNT*)
         (PRINTLN not ok 1 no tests found))
     (PRINTLN (+ 1.. *COUNT*))
     (PRINTLN)
     (IF (EQ *COUNT* *PASSING*)
         (PRINTLN # all tests passed)
         (LET ((FAILING (- *COUNT* *PASSING*)))
           (PRINTLN
            (+ #  FAILING  test
               (IF (> FAILING 1)
                   s
                   )
                failed))))
     (PRINTLN (+ # test finished in  (- ((@ *DATE NOW)) *START-TIME*)  ms))
     (PRINTLN)) */
function exit() {
    if (ISNODE) {
        process.exitCode = COUNT && COUNT === PASSING ? 0 : 1;
    };
    if (!COUNT) {
        println('not ok 1 no tests found');
    };
    println('1..' + COUNT);
    println();
    if (COUNT === PASSING) {
        println('# all tests passed');
    } else {
        var failing = COUNT - PASSING;
        println('# ' + failing + ' test' + (failing > 1 ? 's' : '') + ' failed');
    };
    println('# test finished in ' + (Date.now() - STARTTIME) + ' ms');
    return println();
};
/* (DEFUN SHOW-ERROR (ERROR)
     (PRINTLN   ---)
     (PRINTLN (+   name:  (@ ERROR NAME)))
     (PRINTLN (+   message:  (@ ERROR MESSAGE)))
     (IF (@ ERROR STACK)
         (PROGN
          (PRINTLN   stack:)
          ((@
            ((@ ERROR STACK SPLIT) 
)
            FOR-EACH)
           (LAMBDA (LINE)
             (SETF LINE ((@ LINE TRIM)))
             (IF (NOT (EQ ((@ LINE INDEX-OF) (@ ERROR NAME)) 0))
                 (PRINTLN (+     -  LINE)))))))
     (PRINTLN   ...)) */
function showError(error) {
    println('  ---');
    println('  name: ' + error.name);
    println('  message: ' + error.message);
    if (error.stack) {
        println('  stack:');
        error.stack.split('\n').forEach(function (line) {
            line = line.trim();
            return line.indexOf(error.name) !== 0 ? println('    - ' + line) : null;
        });
    };
    return println('  ...');
};
/* (DEFUN PRINTLN (STR)
     ((@ CONSOLE LOG)
      (IF STR
          ((@ STR REPLACE) 

           )
          ))) */
function println(str) {
    return console.log(str ? str.replace('\n', '') : '');
};
