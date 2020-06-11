# Next Critical

This repository aims to find a solution to enable critical JS and critical CSS in Next.js.

## Usage

Add to your Next project

```bash
yarn add https://github.com/stroeer/next-critical
```

Add to your `next.config.js`

```js
const withCritical = require("next-critical");

module.exports = withCritical();
```

In your app, import `Critical` from `'next-critical/critical'` and refererence any code you would
like to use as critical JS / CSS

```tsx
import React from "react";
import Critical from "next-critical/critical";

const MyPage = () => (
  <main>
    <Critical src="../critical" />
    <h1>Hello world</h1>
  </main>
);

export default MyPage;
```

## About

Implementing critical JS and CSS in Next comes with two basic challenges

1. How to make it work
1. How to design an API that makes critical JS and CSS accessible to Next developers

### How it works

For the first question, this repo can serve as a draft and spark some inspiration.

We implemented this with a combination of a `babel`-, `webpack`- and `next`-plugin. Basically, this is how it works:

1. With a `babel` plugin we find the imports to `'next-critical/critical'` as well as the usages of `<Critical />`.
1. We remove both from the source code, so the actual bundle stays small
1. We memorize the imports referenced with `<Critical />`
1. Using a `webpack` plugin we hook into Next's copilation process and create a child compiler to compile the imports we found with `babel`
1. Using a child compiler means that transpilation works exactly like the rest of the project, so you can use TS and SCSS as targets of the `<Critical />` component
1. Using a `next`-plugin (this seems to be an undocumented unstable API right now) we render the contents of that bundle in the `<head />` of the SSR-rendered document.

Most of this is still experimental but we did not experience any problems yet.

### API considerations

We are still struggling with the design of the API. Using a `<Critical />` tag can provide us with full and precise control over
the contents of the critical JS and CSS, but from an API design's point of view, there are some caveats.

1. For us, precise control may be the way to go, but other developers might prefer convenience over control
1. This API requires providing explicit JS / CSS files that will be used as critical JS / CSS. You cannot reference your React components or other parts of your project to be extracted and added to the critical JS. In other words: You cannot "mark" parts of your project to have those parts act as critical JS /CSS.

This approach can be used to enable the latter of the caveat and solve that problem. The question for us in that regard still is, how would your mark or select parts of your project in terms of an API?

Currently, we see three options, which we would like to demonstrate as dummy code:

```tsx
import { Critical, Inline, withCritical } from "next-critical";
import { Layout, Opener, Hero, Teaser } from "./components";

const CriticalLayout = withCritical(Layout);

<CriticalLayout>
  <Critical>
    <Inline src="myFile.ts" />
    <Inline src="myFile.css" />
    <Opener>
      <Hero />
      <Teaser />
      <Teaser />
    </Opener>
  </Critical>

  <Teaser />
  <Teaser />
  <p>etc</p>
</CriticalLayout>;
```

So we would basicall the types of APIS

- `<Critical />` in contrast to the current implementation, would extract any JS and CSS from its children and use it as critical JS / CSS
- `<Inline />` would resemble our current implementation that puts resources inline in the `<head />` section
- `withCritical` would be an implementation of an HOC that extracts JS and CSS from its wrapped component

each solution has its use case and it's hard for us to tell if there is a single solution that solves all problems.

## Status

I would not use this in production yet but I do think this approach is feasable. I think we
should try this out while we are not live yet and make this stable as we go. I will try and
contact the Next.js guys, do more research on Webpack and maybe find people who know Webpack
to get their advise on what we are doing here.

Todo:

- [ ] Add functionality for Critical CSS
- [ ] TypeScript everything
- [ ] The plugin that removes the webpack runtime does not work in dev mode yet and needs some review
- [ ] Remove Terser from the plugin that removes the webpack runtime
- [ ] Get rid of fractured, hard-coded paths and strings
- [ ] Make sure we are not overwriting stuff with the generated `_critical.js`
- [ ] Make sure what we are doing with Webpack and Next is an ok thing to do
- [ ] Handle errors and Edge-Cases
- [ ] Unit Tests ❗️
