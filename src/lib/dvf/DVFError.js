/**
 * For more info on Custom Errors, check:
 * https://rclayton.silvrback.com/custom-errors-in-node-js
 */
const REASONS = require('./ErrorReasons')

module.exports = class DVFError extends Error {
  constructor(errorCode, data) {
    super(errorCode)

    // ensure the name of this error is the same as the class name
    this.name = this.constructor.name

    // TODO: check if data is not used by Error class
    this.data = data

    if (REASONS[errorCode]) {
      this.reason = REASONS[errorCode].trim()
    } else {
      this.reason = errorCode
    }

    // This clips the constructor invocation from the stack trace.
    // It's not absolutely essential, but it does make the stack trace a little nicer.
    //  @see Node.js reference (bottom)
    Error.captureStackTrace(this, this.constructor)
  }
}