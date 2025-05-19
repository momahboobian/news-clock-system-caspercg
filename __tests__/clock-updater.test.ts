import { CasparClient } from '../src/CasparClient'
import { ClockTicker } from '../src/ClockTicker'

jest.mock('../src/CasparClient')
jest.mock('../src/ClockTicker')

describe('clock-updater.ts', () => {
  it('should initialize CasparClient and start ClockTicker', async () => {
    const connectMock = jest.fn().mockResolvedValue(undefined)
    const sendCommandMock = jest.fn()
    ;(CasparClient as jest.Mock).mockImplementation(() => ({
      connect: connectMock,
      sendCommand: sendCommandMock,
    }))

    const startMock = jest.fn()
    ;(ClockTicker as jest.Mock).mockImplementation(() => ({
      start: startMock,
    }))

    // Dynamically import main to test it
    await import('../src/clock-updater')

    expect(connectMock).toHaveBeenCalled()
    expect(sendCommandMock).toHaveBeenCalledWith('CG 1 ADD 1 "main/MAIN" 1')
    expect(startMock).toHaveBeenCalled()
  })
})
