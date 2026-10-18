# port-light

A Claude Code mod that shows whether TCP ports are in use: a green dot when something is listening, a red dot when the port is free. The dots sit right-aligned in a band above the prompt, one per port, re-checked every 3 seconds.

```
                                        ● 22000  ● 22201
```

## Install

At the prompt of a terminal session:

```
/plugin install port-light --marketplace khanghoang/port-light
```

From a shell:

```
claude plugin install port-light --marketplace khanghoang/port-light
```

In the desktop app, where `/plugin` does not run: click + next to the prompt box, then Plugins, Add marketplace with `khanghoang/port-light`, then Add plugin.

## Configure

The `port` option takes a comma-separated list of ports (default `22000,22201`). Change it in the config menu.

## How it checks

`lsof -nP -iTCP:<port> -sTCP:LISTEN`, falling back to `ss -ltn`. Only listening TCP sockets on the local machine count.
