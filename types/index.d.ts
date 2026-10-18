export type PortStates = Record<string, boolean>

declare module 'claude-code' {
  interface PluginState {
    'port-light': { inUse: PortStates }
  }
}
