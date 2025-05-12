import net from 'net'

export class CasparClient {
  private client: net.Socket

  constructor(private host: string, private port: number) {
    this.client = new net.Socket()
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.connect(this.port, this.host, () => {
        console.log(`✅ Connected to CasparCG at ${this.host}:${this.port}`)
        resolve()
      })
      this.client.on('error', reject)
    })
  }

  sendCommand(command: string): void {
    const fullCommand = command + '\r\n'
    this.client.write(fullCommand)
    console.log('[SENT]', command)
  }
}
