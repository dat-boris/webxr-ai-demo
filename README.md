# WebXR AI Demo

A demo to show how to build a WebXR experiences.

## Getting started

```
cd webxr-client
npm run dev
```


## Web client setup

The client is created with:

```
npm create vite@latest webxr-client -- --template react-ts
npm install three @react-three/fiber @react-three/xr@latest
```

And all files are in the `webxr-client` folder.  The project makes use of
https://github.com/pmndrs/xr.

Also setup HTTPS following: https://v4.vitejs.dev/config/server-options.html
