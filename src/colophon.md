---
title: Colophon
layout: page.njk
alias: colophon
permalink: /colophon/
---

**Technical details about this website.**

### Build and Deployment Architecture

I built this site using [11ty](https://www.11ty.dev), which is a static site generator (soon being rebranded to [Build Awesome](https://build.awesome.me)). I deploy it with [Netlify](https://www.netlify.com/) as a [JAMstack](https://en.wikipedia.org/wiki/JAMstack) provider, with my source files hosted in my [Github](https://www.github.com) repository. 

### Programming Languages

**Scripting**: Eleventy is built on [Node.js](https://nodejs.org/), a runtime environment for running JavaScript outside of a browser. This site's configuration is written in JavaScript, in ESM syntax. That is processed at build time. I also have some client-side JavaScript running on the front-end, but it is minimal. 

**Templating**: This site uses the [Nunjucks](https://mozilla.github.io/nunjucks/) templating engine, with blocks embedded in HTML. 

**Data**: Currently, I use [YAML](https://yaml.org/) as the site's data language for both frontmatter and data files. That said, if need be I could also use JSON or even JavaScript data files. 

**Style**: I use plain CSS without a preprocessor that I wrote and host myself. The one exception is for codeblocks. I used the official 11ty plugin [eleventy-plugin-syntaxhighlight](https://github.com/11ty/eleventy-plugin-syntaxhighlight) which grants access to [PrismJS](https://prismjs.com/) styles for codeblocks. I used this [VS Code to Prism theme converter tool](https://prism.dotenv.dev/) to create a CSS stylesheet from any VS Code/VS Codium theme. I also host this stylesheet natively. 

**Content**: For the most part, content is written in Markdown and parsed with [markdown-it](https://github.com/markdown-it/markdown-it). In addition to adding custom [shortcodes](https://www.11ty.dev/docs/shortcodes/) and [filters](https://www.11ty.dev/docs/filters/) in the configuration file, I also added a few plugins to further customize how I could render the Markdown: 

- [markdown-it-attrs](https://github.com/arve0/markdown-it-attrs) - allows for adding custom attributes and classes to blocks
- [markdown-it-bracketed-spans](https://github.com/mb21/markdown-it-bracketed-spans) - an add-on to markdown-it-attrs, allows for creating a span element and adding inline attributes and/or classes
- [@mdit/plugin-footnote](https://mdit-plugins.github.io/footnote.html) - footnotes

**Other**: Versioned using Git. Packaged via [npm](https://www.npmjs.com/), package details in package.json at project root of repository. 

### Design

I "dithered" the avatar image of me on the home page using a tool called [dither me this](https://doodad.dev/dither-me-this/). I was able to match the color scheme of the website and resize the image to reduce the load on the page. I liked the effect for a terminal-style site so I reused the tool for an image of a crossroads [that I put on a post](./posts/2025-10-18-algorithms-randomness-algorithmic-randomness/).

For icons, the site uses a free version of [Font Awesome](https://fontawesome.com/kits/1df0fd71fd/icons), which is imported as an external script. Icons are rendered like fonts. 

The favicon for the site (icon by the URL bar) was generated at [favicon.io](https://favicon.io/favicon-generator/).

#### Fonts

The title font on the home page is [Press Start 2P](https://fonts.google.com/?query=Press+Start+2P). Text and code are in [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono). Both fonts are imported from Google Fonts. 

#### Colors

The color scheme of the site is based off of four main hues and white. The four hues are: purple, magenta, blue, and yellow. 

The white color has a hex value of `#fafafa` and is the main text color of the site. 

The other four colors each have five values:

| Color | Light | Mid-Light | Root | Mid-Dark | Dark |
|:-----:|:-----:|:---------:|:----:|:--------:|:----:|
| Purple | #A078E4 (terminal border) | #6B3EBA | #461691 (outer background) | #2b0A65 (top level heading background) | #0A0119 (terminal background) |
| Magenta | #F173AF (home page description & subtitle) | #DB3A86 (home page title shadow) | #BD0A5F (blockquote border) | #7B013B (background bar with post metadata) | #1E000E |
| Blue | #73B1E1 (links) | #377DB2 | #105991 | #07395F | #010E17 (draggable bar in draggable modals) |
| Yellow | #FFEF7A (link underline) | #FFE943 | #E2C90B (codeblock borders) | #948201 (icon color for social media links) | #242000 |

### Readers and Engagement

I used [11ty's official RSS plugin](https://www.11ty.dev/docs/plugins/rss/) to create an [Atom feed](/feed.xml) of the blog. The feed only curates [blog posts](/blog/), not any static pages (such as this one). 

I use [Komments](https://komments.cloud/) to add an embedded commenting page to each post. This is embedded in an `<iframe>`, so the comments are actually hosted externally. 

I am also set up to receive [webmentions](https://webmention.io/), which is something I'm still trying to figure out. 