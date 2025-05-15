import { CasparClient } from '../src/CasparClient'
import net from 'net'

jest.mock('net')

describe('CasparClient', () => {
  let mockWrite: jest.Mock
  let mockConnect: jest.Mock
  let mockOn: jest.Mock

  beforeEach(() => {
    mockWrite = jest.fn()
    mockConnect = jest.fn((_port, _host, cb) => cb && cb())
    mockOn = jest.fn()

    // @ts-ignore
    net.Socket.mockImplementation(() => ({
      connect: mockConnect,
      write: mockWrite,
      on: mockOn,
    }))
  })

  it('should connect to localhost on port 5250', async () => {
    const client = new CasparClient('localhost', 5250)
    await client.connect()
    client.sendCommand('CG 1 ADD 1 main/MAIN 1')

    expect(mockConnect).toHaveBeenCalledWith(5250, 'localhost', expect.any(Function))
    expect(mockWrite).toHaveBeenCalledTimes(1)
    expect(mockWrite).toHaveBeenCalledWith('CG 1 ADD 1 main/MAIN 1\r\n')
  })

  it('sends commands with \\r\\n', async () => {
    const client = new CasparClient('localhost', 5250)
    await client.connect()
    client.sendCommand('CG 1 ADD 1 main/MAIN 1')

    expect(mockWrite).toHaveBeenCalledWith('CG 1 ADD 1 main/MAIN 1\r\n')
  })

  it('sends time updates correctly', async () => {
    const client = new CasparClient('localhost', 5250)
    await client.connect()

    const command = `CG 1 INVOKE 1 "leftTab('on', 'BBC NEWS 10:45')"`
    client.sendCommand(command)

    expect(mockWrite).toHaveBeenCalledWith(`${command}\r\n`)
  })

  it('should reject on socket error during connect', async () => {
    const errorHandler = jest.fn()
    const mockError = new Error('Connection failed')

    mockConnect.mockImplementationOnce((_port, _host, _cb) => {
      setImmediate(() => {
        mockOn.mock.calls.forEach(([event, handler]) => {
          if (event === 'error') handler(mockError)
        })
      })
    })

    const client = new CasparClient('localhost', 5250)

    await expect(client.connect()).rejects.toThrow('Connection failed')
  })
})
