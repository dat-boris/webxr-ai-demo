# WebXR AI Demo

A demo to show how to build a WebXR experiences.

![Watch the video](webxr-demo.mp4)

## Getting started

### Running client server

Then run the client server
```
cd webxr-client
npm run dev
```

And then open the URL to your local host:

```
https://localhost:5173/?ok=<OpenAI APIkey>
```

> [!WARNING]
> This key is NOT securied as it is held in your browser. Generate it one off
> for demo at https://platform.openai.com/settings/organization/api-keys
> and remove it afterwards.

### (optional) For Vision capability

> Only avaliable if you are using Oculus Quest

Open your local server by:

```
cd server
node server.js
```

Which will run the local server.

> [!WARNING]
> the image from the server is publically accessible - you should at least
> change the ngrok server URL in:
> - server/package.json
> - webxr-client/src/whisperhook.tsx

Then go to https://www.oculus.com/casting and copy and paste the content from
[oculus_cast_hack.js] into the JS console.

Now when you want to script to be able to see, change the `enableOculusHack`
option for `useWhispherChat` to `true`.

## Web client setup

The client is created with:

```
npm create vite@latest webxr-client -- --template react-ts
npm install three @react-three/fiber @react-three/xr@latest
```

And all files are in the `webxr-client` folder.  The project makes use of
https://github.com/pmndrs/xr.

Also setup HTTPS following: https://v4.vitejs.dev/config/server-options.html
