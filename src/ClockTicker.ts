import { CasparClient } from './CasparClient'
import { CHANNEL, LAYER } from './config'

export class ClockTicker {
  private interval?: NodeJS.Timeout

  constructor(private client: CasparClient, private getNow = () => new Date()) {}

  start() {
    this.tick()
    const delay = 60000 - (this.getNow().getTime() % 60000)
    setTimeout(() => {
      this.tick()
      this.interval = setInterval(() => this.tick(), 60000)
    }, delay)
  }

  private tick() {
    const now = this.getNow()
    const hhmm = now.toTimeString().substring(0, 5)
    const command = `CG ${CHANNEL} INVOKE ${LAYER} "leftTab('on', 'BBC NEWS ${hhmm}')"`
    this.client.sendCommand(command)
  }
}
