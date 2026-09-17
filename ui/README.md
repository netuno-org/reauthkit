
### Install packages

```bash
bun install
bun pm trust --all
```

### Watch changes and rebuild automatically

```bash
bun run watch
```

The watch script is defined in `package.json` and writes the back-office UI bundle to the application's `public` folder.
