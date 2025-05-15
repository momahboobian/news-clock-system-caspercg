import { ClockTicker } from '../src/ClockTicker'
import { CasparClient } from '../src/CasparClient'

jest.useFakeTimers()

describe('ClockTicker', () => {
  const mockSendCommand = jest.fn()
  const mockClient = { sendCommand: mockSendCommand } as unknown as CasparClient

  beforeEach(() => {
    jest.clearAllTimers()
    jest.clearAllMocks()
  })

  it('sends initial time update on start', () => {
    const ticker = new ClockTicker(mockClient)
    ticker.start()

    expect(mockSendCommand).toHaveBeenCalledTimes(1)
    expect(mockSendCommand.mock.calls[0][0]).toMatch(
      /^CG 1 INVOKE 1 "leftTab\('on', 'BBC NEWS \d{2}:\d{2}'\)"$/
    )
  })

  it('sends update every minute', () => {
    const ticker = new ClockTicker(mockClient)
    ticker.start()

    jest.advanceTimersByTime(60 * 1000)

    expect(mockSendCommand).toHaveBeenCalledTimes(2)
  })
})
