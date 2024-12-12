# WebXR AI Demo

A demo to show how to build a WebXR experiences.

![Watch the video](webxr-demo.mp4)

## Getting started

```
cd webxr-client
npm run dev
```

And then open the URL to your local host:

```
https://localhost:5173/?ok=<OpenAI APIkey>
```

CAREFUL! This key is NOT securied as it is held in your browser. Generate it one off for demo at
https://platform.openai.com/settings/organization/api-keys
and remove it afterwards.


## Web client setup

The client is created with:

```
npm create vite@latest webxr-client -- --template react-ts
npm install three @react-three/fiber @react-three/xr@latest
```

And all files are in the `webxr-client` folder.  The project makes use of
https://github.com/pmndrs/xr.

Also setup HTTPS following: https://v4.vitejs.dev/config/server-options.html
