# ReAuthKit Website

The restricted front-end application for ReAuthKit.

This module provides the user-facing web interface, including registration, login, profile editing, and the reserved area.

It is built with React, Redux, Ant Design, and Vite.

### Installation

Bun is required to install the dependencies.

```bash
bun install
bun pm trust --all
```

### Development

To start the development server with hot-reload:

```bash
bun run dev
```

### Production Build

To build the optimized production version, run the provided scripts:

* Linux / macOS: `bash build.sh`
* Windows: `.\build.bat`

These scripts run `npm install --force` and `npm run build` (Vite), producing the optimized output in `website/dist`.
