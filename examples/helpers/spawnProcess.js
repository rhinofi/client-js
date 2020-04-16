const { spawn } = require('child_process')

const logProc = (proc, ProcName = '') => {
  const logStream = streamName => {
    const listener = buffer =>
      console.log(`'${ProcName}' (${streamName}): ${buffer.toString()}`)
    proc[streamName].on('data', listener)

    return [streamName, listener]
  }

  const listeners = [logStream('stderr'), logStream('stdout')]

  return () => listeners.forEach(([name, l]) => proc.removeListener(name, l))
}

const waitForLogLine = (proc, { streamName = 'stdout', logDebug }) => {
  return ({match, timeout = 30000}) => new Promise((resolve, reject) => {
    logDebug('waiting for log:', match)

    let timedOut = false
    let failTimeout

    const onData = buffer => {
      if (timedOut) return

      const logLine = buffer.toString()
      if (logLine.match(match)) {
        proc[streamName].removeListener('data', onData)

        logDebug('got a match for:', match)
        logDebug('matched log:', logLine)
        resolve()
      }
    }

    if (timeout) {
      failTimeout = setTimeout(
        () => {
          proc[streamName].removeListener('data', onData)

          timedOut = true
          reject(new Error(`timed out after: ${timeout} ms`))
        },
        timeout
      )
    }

    proc[streamName].on('data', onData)
  })
}

module.exports = async (options = {}) => {
  const {
    command = ['npm', 'run', 'start'],
    env = process.env,
    // This is needed when proc spawns a subprocess
    detached = true,
    waitForLogOnInit,
    log = false,
    debug = false,
    debugName = '',
    cwd
  } = options

  const logDebug = debug
    ? (...args) =>
      console.log.apply(console, [`spawnProcess ${debugName}:`].concat(args))
    : () => {}

  const commandStr = command.join(' ')
  const [executable, ...args] = command

  const proc = spawn(executable, args, {
    env,
    detached,
    cwd
  })

  // Make sure we kill the child if our main process gets killed, since
  // in detached mode the signal does not get propagated
  if (detached) {
    ;['SIGINT', 'SIGTERM'].forEach(signal => {
      process.once(signal, () => {
        logDebug('Parent process received signal:', signal)
        logDebug(`killing "${commandStr}" (pid: ${proc.pid})`)
        process.kill(-proc.pid, signal)
      })

      logDebug('wired signal handler for:', signal)
    })
  }

  if (log) logProc(proc, commandStr)

  const waitForLog = waitForLogLine(proc, { logDebug })

  if (waitForLogOnInit) await waitForLog(waitForLogOnInit)

  // TODO: rewrite in terms of waitForExit
  const kill = (expectedCode, signal, waitForLogOnEnd) =>
    new Promise((resolve, reject) => {
      logDebug(
        `killing "${commandStr}" (pid: ${proc.pid}) with signal: ${signal}`
      )

      const loggedBeforeEndP = waitForLogOnEnd
        ? waitForLog(waitForLogOnEnd)
        : Promise.resolve()

      const processExitCode = exitCode => {
        logDebug('processExitCode', { expectedCode, signal, exitCode })

        expectedCode === null || exitCode === expectedCode
          ? resolve(loggedBeforeEndP)
          : reject(
            new Error(
              `unexpected exit code: ${exitCode}, expected: ${expectedCode}`
            )
          )
      }

      if (proc.killed) {
        processExitCode(proc.exitCode)
      } else {
        logDebug('proc not killed')

        proc.once('close', processExitCode)
        proc.once('error', reject)
        // This is used when proc spawns a subprocess, since proc.kill() will not work (at least not on linux)
        detached ? process.kill(-proc.pid, signal) : proc.kill(signal)
      }
    })

  const waitForExit = (expectedCode) => (timeout) =>
    new Promise((resolve, reject) => {
      logDebug(
        `waiting for "${commandStr}" (pid: ${proc.pid}) to exit with code:
        ${expectedCode}, before timeout: ${timeout});`
      )

      let timedOut = false

      const failTimeout = setTimeout(
        () => {
          timedOut = true
          reject(new Error(`timed out after: ${timeout} ms`))
        },
        timeout
      )

      const success = () => {
        clearTimeout(failTimeout)
        resolve()
      }

      const processExitCode = exitCode => {
        logDebug('processExitCode', { expectedCode, exitCode })

        expectedCode === null || exitCode === expectedCode
          ? success()
          : reject(
            new Error(
              `unexpected exit code: ${exitCode}, expected: ${expectedCode}`
            )
          )
      }

      if (proc.exitCode != null || proc.killed) {
        processExitCode(proc.exitCode)
      } else {
        logDebug('process still alive')

        proc.once('close', (code) => timedOut || processExitCode(code))
        proc.once('error', reject)
      }
    })

  return {
    proc,
    kill,
    waitForLog,
    waitForExit,
    waitForCleanExit: waitForExit(0)
  }
}
