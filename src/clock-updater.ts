import { CasparClient } from './CasparClient'
import { ClockTicker } from './ClockTicker'
import { CHANNEL, LAYER, TEMPLATE } from './config'

async function main() {
  const client = new CasparClient('127.0.0.1', 5250)
  await client.connect()
  client.sendCommand(`CG ${CHANNEL} ADD ${LAYER} ${TEMPLATE} 1`)
  const ticker = new ClockTicker(client)
  ticker.start()
}

main()
