# ReactApp with Parcel and antd

## Building a web app with Parcel

This repo was building by [parcel](https://parceljs.org/getting-started/webapp/).

###  A. Start parcel to render webpage

- Install parcel 

```
npm install --save-dev parcel 
```

- set index.html

src/index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>My First Parcel App</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
```

- rend index.html 

```
npx parcel src/index.html 
```

###  B. Start parcel to render react

structure

```
/js-parcel-react-glsl
├── src 
│  ├── components
│  │   └── App.js
│  ├── index.html 
│  └── index.js
├── .gitignore 
├── package.json 
└── Readme.md
```

prepare the intila file: `src/index.html`, `src/index.js`, src/App.js:

`src/index.html`
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My Parcel App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="index.js"></script>
  </body>
</html>
```

-   `src/index.js`

```js
import { createRoot } from "react-dom/client";
import { App } from "./components/App";

const container = document.getElementById("app");
const root = createRoot(container)
root.render(<App />);
```

-   `src/App.js`

```js
export function App() {
  return <h1>Hello world!</h1>;
}
```

- install react react-dom

```
npm i --save react react-dom  
```

- Add `"start"` scripts to the `package.json` file  

```
"scripts": {
  "start": "parcel src/index.html",
  "build": "parcel build src/index.html"
  },
```

- run react

```sh
npm start
```

or

```sh
npx parcel src/index.html
```

### `.gitignore`

- `.gitignore`

```shell
/node_modules
/.parcel-cache
/dist
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

## Running this project

This project is set up with [Parcel Bundler](https://parceljs.org/), an npm package
that compiles our frontend assets and comes with an integrated development server.

The dev server runs on port `1234` by default, but will use another if `1234` is
being used by another application.

- Clone the repo.
- Navigate into the project folder.
- Run `npm i` to download the project's dependencies listed in the `package.json`.
- Run `npm start` to compile the React project and spin up the app on `http://localhost:1234`.

