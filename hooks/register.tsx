import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { PortStates } from '../types'

const inUse = atom({ plugin: 'port-light', key: 'inUse' } as const, {} as PortStates)

async function check($: any, ports: string[]) {
  const next: PortStates = {}
  for (const port of ports) {
    const script = `lsof -nP -iTCP:${port} -sTCP:LISTEN -t 2>/dev/null | grep -q . || ss -ltn 2>/dev/null | grep -q ":${port} "`
    const { exitCode } = await $.process.run(['sh', '-c', script], { timeoutMs: 5000 })
    next[port] = exitCode === 0
  }
  await update($, inUse, () => next)
}

export const register: Register = (on, options) => {
  const ports = String(options?.port ?? '22000')
    .split(/[,\s]+/)
    .filter(p => /^\d{1,5}$/.test(p))

  on('session.start', async ($, e, next) => {
    await check($, ports)
    $.clock.every(3000, () => check($, ports))
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const states = await read($, inUse)
    if (ports.length === 0 || Object.keys(states).length === 0 || e.props.hasSurvey) return next(e)

    const { Box, Text } = $.ui.resolve(e)

    return (
      <Box justifyContent="flex-end">
        {ports.map(port => (
          <Box key={port}>
            <Text color={states[port] ? 'green' : 'red'}>●</Text>
            <Text dimColor> {port}  </Text>
          </Box>
        ))}
      </Box>
    )
  })
}
