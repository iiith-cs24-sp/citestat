# Citestat

Run from the root of the project:

```bash
npm install
npm run start
```

then visit <http://localhost:5173>

Although the project has client and server folders, the server is not required and will be removed later.  
We were able to _optimize_ the web-application enough to run it in the browser.  
As a result, the app fits the conditions for Vercel's free tier.

The app (production) is live at
<https://citestat.vercel.app>

New commits to the master branch on GitHub trigger a new deployment to production.

You may also run the client alone locally with:

```bash
cd client
npm install
npm run start # dev server
```

Or build the client for production with:

```bash
cd client
npm run build
npm run preview # serve the dist folder
```

Other npm scripts:

```bash
npm run lint # lint with eslint
npm run format # format with prettier
npm run doc # generate documentation with typedoc
```

The client folder has [its own README](./client/README.md) with more information.
