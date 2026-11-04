# stageroll-site

The website at [stageroll.co](https://stageroll.co).

```sh
yarn install
yarn dev        # http://localhost:5173
yarn build      # static build in dist/
```

Pushing to `main` builds and deploys it to GitHub Pages.

## Pages the app opens

The app opens `/help/`, `/about/`, `/terms/` and `/privacy/` with
`?from=app` (stageroll-native `src/site.ts`). The head script in
`index.html` then marks the tab `in-app` for as long as it stays open, and
everything marked `.sells` is hidden: Pricing in the nav and footer, the
account link, a page's own link to Pricing. Outside the US the App Store
allows no link, button or words inside an app that lead to buying outside
it. A new link to Pricing or an account page carries `className="sells"`;
inside a sentence, put its words beside it as `<span className="app-only">`.
