import net from 'net'
import { send } from 'process'

const HOST = '127.0.0.1'
const PORT = 5250

const CHANNEL = 1
const LAYER = 1
const TEMPLATE = 'main/MAIN'

let client: net.Socket

// Format time as HH:MM
function getCurrentTime(): string {
  const now = new Date()
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

// Send an AMCP command with proper line endings

function sendCommand(command: string) {
  const fullCommand = `${command}\r\n`
  client.write(fullCommand)
  console.log(`[SENT] ${fullCommand.trim()}`)
}

// schedule an INVOKE command to run every minute on the minute
function scheduleClockUpdates() {
  const now = new Date()
  const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()

  setTimeout(() => {
    // First, send right on the next minute
    sendClockUpdate()

    // Then, schedule every minute after that
    setInterval(sendClockUpdate, 60 * 1000)
  }, msToNextMinute)
}

// build and zend the INVOKE command
function sendClockUpdate() {
  const timeString = getCurrentTime()
  const invokeCommand = `CG ${CHANNEL} INVOKE ${LAYER} "leftTab('on', 'BBC NEWS ${timeString}')"`
  sendCommand(invokeCommand)
}

// Start the app
function start() {
  client = net.createConnection(PORT, HOST, () => {
    console.log(`Connected to CasparCG (mock) at ${HOST}:${PORT}`)

    //SEND CG ADD to load the template
    const addCommand = `CG ${CHANNEL} ADD ${LAYER} ${TEMPLATE} 1`
    sendCommand(addCommand)

    // SCHEDULE TIME UPDATES
    scheduleClockUpdates()
  })

  client.on('error', err => {
    console.error(`Socket error:, ${err.message}`)
    process.exit(1)
  })

  client.on('end', () => {
    console.log('Disconnected from CasparCG')
  })
}

start()
