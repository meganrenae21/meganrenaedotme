---
layout: post.njk
title: "Third Iteration: Welcome to My 11ty Terminal"
date: 2026-10-28
permalink: posts/third-iteration-my-11ty-terminal.html
tags: [eleventy, blogging, webdev]
comments_url: https://komments.cloud/c4b05116af7983304cba41
---

It has been a year since my last post, and I have ([again](posts/org-to-jekyll-new-beginning/)) decided to revamp this space. This time I've moved over from [Jekyll](https://jekyllrb.com) to [Eleventy](https://11ty.dev). And now I'm going to tell you how and why. 

### Why Eleventy?

The main thing I realized that Eleventy offered was more flexibility over my workflow. While Eleventy is zero-config by default, it runs on Node.js/JavaScript, and I am comfortable adjusting my own configuration and plugin settings. Jekyll runs on Ruby, which is not a language I'm familiar with, and has a more opinionated ecosystem. 

With Eleventy, I was not locked in to a single templating language or directory structure. Jekyll uses the template language [Liquid](https://shopify.github.io/liquid/), which I found simple enough to learn. Eleventy offers Liquid as a default as well, though I went for [Nunjucks](https://mozilla.github.io/nunjucks/), which is a very similar templating language to Liquid but one that allows you to call JavaScript functions on variables. 

So, being able to easily integrate JavaScript on the client- and server-side made the biggest difference. That said, I still wanted to make sure I knew what I was doing before I decided to migrate everything over.  

### The Bellwether

I decided that the best way to learn was to create my own starter template. The result was The Bellwether[^1]. I was looking for a good-sounding word and *bellwether* happened to be [Merriam-Webster's](https://www.merriam-webster.com/) word of the day on the day I started working on it. 

When I first started, I thought I was creating a starter template I could use when I made the switch. I leaned into a minimalist style; in fact, one of the first things I did was select the **two** colors and **three** fonts that would make up the site, and add these as variables in my CSS file:

```css
:root {
  --light-color: #fbdcf1;
  --dark-color: #2a051d;
  --head-font: "Francois One", sans-serif;
  --text-font: "Sofia Sans", monospace;
  --code-font: "Inconsolata", monospace;
}
```

For the most part, I was pretty comfortable setting up my project structure and files the way I wanted. I spent most of my time focusing on the actual web design of the site.

#### The draft process

When I start a web project, I always begin by sketching out the design in either [Codepen](https://codepen.io) or [CodeSandbox](https://codesandbox.io). In this case, it was CodeSandbox, because there I can work on a private, multi-file, multi-directory draft project. 

The goal of this is to set up a working prototype of how the site is supposed to work without the templating tools or configuration available in Eleventy. So first you construct the site as a whole, then you can **deconstruct** various pieces into layouts, includes, variables, data files, etc...

For example, the Bellwether has a two-column layout for pages, and the home page in my CodeSandbox project has this code:

```html
    <div class="main-col" id="left-col">
      <img src="https://picsum.photos/id/64/400" alt="photograph of woman holding bouquet of picked wildflowers" id="title-image" />
      <h1 id="site-title">the bellwether</h1>
      <p class="subtitle">etiam dictum tellus</p>
      <div id="link-bar">
        <a class="nav-link" href="index.html">home</a>
        <a class="nav-link" href="about.html">about</a>
        <a class="nav-link" href="tags.html">tags</a>
        <a class="nav-link" href="archive.html">archive</a>
      </div>
    </div>
```

In the final version, that's replaced with:

{% raw %}
```html
<div class="main-col" id="left-col">
    <img src={% baseAsset "bw-title-image.jpg" %} alt="photograph of woman holding bouquet of picked wildflowers" id="title-image" />
    <h1 id="site-title">{{ site.title }}</h1>
    <p class="subtitle">{{ site.subtitle }}</p> 
    <div id="link-bar">
    <a class="nav-link" href="{{ paths.home }}">home</a>
    {%- for page in collections.pages -%}
        <a class="nav-link" href="{{ page.url }}">{{ page.data.title }}</a>
    {%- endfor -%}
    </div>
</div>
```
{% endraw %}

And that may not seem like much, but keep in mmind the index page lists the 10 latest blog posts. This is what that looks like (in the following, for length, I'm only listing one post):

{% raw %}
```html
<div class="main-col" id="right-col">
    <h2 class="post-head">latest</h2>
    <div id="index">
        <p><span class="list-post-date">SEP272026</span> <a class="list-post-title" href="posts/20260927-nunc-aliquam-ultrices.html">Nunc aliquam sem in orci hendrerit: eu vehicula velit ultrices</a> <a class="list-post-tag" href="#">fine</a> <a class="list-post-tag" href="#">species</a>
        </p>
        <!-- remaining 9 posts go here -->
    </div>
</div>  
```
{% endraw %}

In the final version's `page.njk` layout, this becomes:

{% raw %}
```html
<div class="main-col" id="right-col">
    {{ content | safe }}
</div>
```
{% endraw %}

Then we can go to `index.html` to see what is in {% raw %}`{{ content | safe }}`{% endraw %}:

{% raw %}
```html
<h2 class="post-head">latest</h2>
<div id="index">
    {%- for post in collections.posts | reverse -%}
    <p><span class="list-post-date">{{ post.date | indexDate }}</span> <a class="list-post-title" href="{{ post.url }}">{{ post.data.title }}</a> 
        {%- if post.data.tags -%}
        {%- for tag in post.data.tags -%}
        <a class="list-post-tag" href="/tags/{{ tag }}.html">{{ tag }}</a>
        {%- endfor -%}
        {%- endif -%}
    </p> 
    {%- endfor -%}
</div>
```
{% endraw %}

#### The Deconstruction Process

##### Collections

Now, the first thing to get the templates working correctly is to ensure that our posts and pages are in the proper *collection*[^2]. Eleventy provides the frontmatter property "Tags", which can be an array of strings. Each "tag" has a collection of files in which it is included in the "tags" array. 

The documentation suggests using "post" as a tag to create a collection of "posts" for a blog, but I wanted to use tags *as* tags. Instead I looked into the [Collections API](https://www.11ty.dev/docs/collections-api/) create my own custom collections. 

Every file of The Bellwether would be assigned either a `page.njk` layout or a `post.njk` layout --- and this was assigned in the "layout" frontmatter property. In the config file, `eleventy.config.js`, I could use this property to separate posts from pages and create two different collections using the provided API. 

```javascript
export default function (eleventyConfig) {
    eleventyConfig.addCollection("pages", function (collectionsApi) {
        return collectionsApi.getAllSorted().filter(function (item) {
            return item.data.layout === "page.njk"
        })
    })
    eleventyConfig.addCollection("posts", function (collectionsApi) {
        return collectionsApi.getAllSorted().filter(function (item) {
            return item.data.layout === "post.njk"
        })
    })
}
```

With the above, all posts will be available via `collections.posts` and all pages will be available via `collections.pages`. And since I don't want the 404 page to appear in the navigation bar where I am linking to all pages, Eleventy has provided another handy frontmatter property: `eleventyExcludeFromCollections`. By setting this as true in the frontmatter of `404.md` it will be skipped. 

So now we can successfully turn this:

```html
<div id="link-bar">
    <a class="nav-link" href="index.html">home</a>
    <a class="nav-link" href="about.html">about</a>
    <a class="nav-link" href="tags.html">tags</a>
    <a class="nav-link" href="archive.html">archive</a>
</div>
```

into this:

{% raw %}
```html
{%- for page in collections.pages -%}
    <a class="nav-link" href="{{ page.url }}">{{ page.data.title }}</a>
{%- endfor -%}
```
{% endraw %}

And in `index.html` we can start building our "index" of blog posts:

{% raw %}
```html
<h2 class="post-head">latest</h2>
<div id="index">
    {%- for post in collections.posts | reverse -%}
    <p><a class="list-post-title" href="{{ post.url }}">{{ post.data.title }}</a> 
    </p> 
    {%- endfor -%}
</div>
```
{% endraw %}

##### Adding a Tags Collection and Generating Tag Pages

The `addCollection` method can return any object type, meaning I could create a collection of strings. I could configure Eleventy to create a collection of every tag used on a post like this:

```javascript
export default function (eleventyConfig) {
    eleventyConfig.addCollection("tags", function (collectionsApi) {
        const tags = new Set();
        collectionsApi.getAll().forEach(function (item) {
            if ("tags" in item.data) {
                let tagsList = item.data.tags;
                if (typeof tagsList === "string") {
                    tagsList = [tagsList];
                }
                for (const tag of tagsList) {
                    tags.add(tag)
                }
            }
        })
        return [...tags].sort();
    })
}
```

Now, every tag on the site can be accessed via `collections.tags`. Using Eleventy's [pagination](https://www.11ty.dev/docs/pagination/) feature, we can generate tag pages for each tag using the frontmatter object property `pagination`, which should have at least these two properties: `data`, which gives the dataset to be iterated, and `size` which gives how many items to be iterated per page. Given the following YAML frontmatter--

```yaml
pagination: 
  data: collections.tags
  size: 1
```

--we can create a page per tag. 

The complete frontmatter in our `tags/tag.html` source file is set up like this:

```yaml
---
eleventyExcludeFromCollections: true
layout: page.njk
pagination: 
  data: collections.tags
  size: 1
  alias: tag
---
```

And then we can set up the template like this:

{% raw %}
```html
<h2 class="post-head">posts tagged with <em>{{ tag }}</em></h2>
<div id="index">
    {%- for post in collections.posts | reverse -%}
        {%- if tag in post.data.tags -%}
        <p><span class="list-post-date">{{ post.date }}</span> <a class="list-post-title" href="{{ post.url }}">{{ post.data.title }}</a></p>
        {%- endif -%}
    {%- endfor -%}
</div>
```
{% endraw %}

Now that we have our tag pages set up, we can go ahead and expand on the template for our index page. 

{% raw %}
```html
{%- for post in collections.posts | reverse -%}
<p><span class="list-post-date">{{ post.date }}</span> <a class="list-post-title" href="{{ post.url }}">{{ post.data.title }}</a> 
    {%- if post.data.tags -%}
    {%- for tag in post.data.tags -%}
    <a class="list-post-tag" href="/tags/{{ tag }}.html">{{ tag }}</a>
    {%- endfor -%}
    {%- endif -%}
</p> 
{%- endfor -%}
```
{% endraw %}

We can also create a `tags.html` page to create a list of links to every tag page. 

{% raw %}
```html
---
title: tags
layout: page.njk
permalink: tags.html
---

<h2 class="post-head">tags</h2>
<div class="tag-cloud">
    {%- for tag in collections.tags -%}
        <a class="tag" href="/tags/{{ tag | slug }}.html">{{ tag }}</a>
    {%- endfor -%}
</div>
```
{% endraw %}

##### Creating Variables and Working with Data

###### Site-wide data

The `index.html` file had this snippet: 

```html
<h1 id="site-title">the bellwether</h1>
<p class="subtitle">etiam dictum tellus</p>
```

I set up a global data directory `_data/` where I had a file `site.yaml`, which stored some basic variables, like title and subtitle. These could be accessed via `site.title` and `site.subtitle`. I didn't make the most of these global data files--definitely not as much as I could have--but this meant I could update the above to:

{% raw %}
```html
<h1 id="site-title">{{ site.title }}</h1>
<p class="subtitle">{{ site.subtitle }}</p>
```
{% endraw %}

Now, technically these variables *could* be made available just via `title` and `subtitle` but global data files are prioritized **last** in the [Eleventy Data Cascade](https://www.11ty.dev/docs/data-cascade/). The variable `title`, in particular, is used on the `page` object, and any frontmatter data would take precedent over global data. Therefore, we want to be as specific as possible. 

###### Shortcodes

I love [shortcodes](https://www.11ty.dev/docs/shortcodes/)[^3]. A shortcode has a name, and it can take any number of arguments. It's basically a function. 

In *The Bellwether*, I have a photograph on the home page, and this is the line of code that code through on the published version of the page:

```html
<img src="/assets/base/bw-title-image.jpg" alt="photograph of woman holding bouquet of picked wildflowers" id="title-image">
```

I haven't talked yet about how Eleventy builds the site, but, unless configured otherwise, the files that are processed are processed in the same position in the output folder that they were placed in the input folder. So in the project directory, the input directory was the root directory, and the output directory was `_site/`. The `/assets/` folder was at `/assets/` in the root directory and `/_site/assets/`. This meant that any code I wrote that was dependent on the file structure wouldn't break on build. 

I wanted to organize asset files to separate those for a particular post, a particular page, and those that were part of the base of the website or that would be repeated. This was my solution:

```plaintext
.
├── about.html
├── tags.html
├── archive.html
├── posts/
│   ├── this-is-a-post.html
│   ├── another-post.html
│   └── just-one-more.html
└── assets/
    ├── base/
    ├── pages/
    │   ├── about/
    │   ├── tags/
    │   └── archive/
    └── posts/
        ├── this-is-a-post/
        ├── another-post/
        └── just-one-more/
```

So an image that would go under `this-is-a-post.html` would be file in `assets/posts/this-is-a-post/`, one that would be in `about.html` would be filed in `assets/pages/about/`, and the `bw-title-image.jpg` above that was a part of the `page.njk` layout would be filed under `assets/base/`. 

I created two shortcodes: `asset` and `baseAsset`.

```javascript
export default function (eleventyConfig) {
    eleventyConfig.addShortcode("asset", function(filename) {
        if (this.page.url.startsWith("/posts/")) {
            return `/assets/posts/${this.page.fileSlug}/${filename}`;
        }

        return `/assets/pages/${this.page.fileSlug}/${filename}`;
    })
    eleventyConfig.addShortcode("baseAsset", function(filename) {
        return `/assets/base/${filename}`;
    })    
}
```

If I had a post from October 16, 2025, titled: "I had an amazing day at the Texas Rodeo Fest Slash Monster Truck Show!" with the slug 10-16-2025-amazing-day-tx-rodeo-fest-monster-truck-show and an image `rodeo-clown.jpg`, I *could* retrieve that image path like normal:

`/assets/posts/10-16-2025-amazing-day-tx-rodeo-fest-monster-truck-show/rodeo-clown.jpg`

or I could enter this shortcode:

{% raw %}`{% asset "rodeo-clown.jpg" %}`{% endraw %}

And the code for The Bellwether's image became:

{% raw %}
```html
<img src={% baseAsset "bw-title-image.jpg" %} alt="photograph of woman holding bouquet of picked wildflowers" id="title-image">
```
{% endraw %}

###### Custom Filters (and working with dates)

Let's go back to my original draft in CodeSandbox, to when I drafted the site index. In particular, look at how I want the date to be formatted beside each post: 

```html
<span class="list-post-date">SEP272026</span>
```

Before I go any further, I should mention a disconnect that occurred with my dates between the input and the output. I input dates in frontmatter as YYYY-MM-DD, which Eleventy assumes as midnight in UTC. What happens is that the dates are then localized when displayed. For me, that means 5 or 6 hours behind UTC[^4]. 

The answer is to convert the date to a string before it can be localized. I can do that in the same function I use to create the format I want: by using a custom filter. In this case, I need an external plugin -- luxon -- to make it work, so I install it via npm.

```bash
npm install luxon --save
```

Using [luxon tokens](https://moment.github.io/luxon/#/formatting?id=table-of-tokens), it's possible to create a datestamp in just about any format imaginable. 

```javascript
import { DateTime } from "luxon";

export default function (eleventyConfig) {
    eleventyConfig.addFilter("indexDate", (dateObj) => {
        return DateTime
        .fromJSDate(dateObj, {zone: "utc"})
        .toFormat("LLLddyyyy")
        .toUpperCase();
    })
}
```

In Nunjucks (and Liquid), we can use filters with the pipe ("|") character:

{% raw %}
```html
<span class="list-post-date">{{ post.date | indexDate }}</span> 
```
{% endraw %}

#### Playing Around

Once I found my way, I started having a lot of fun. I wanted The Bellwether to be a template for a blog focused on long-form content that didn't sacrifice aesthetics, so I began focusing on creating a minimalist magazine-lite type of style for my post layout ([example](https://the-bellwether.meganrenae.me/posts/20260924-bells-whistles)). 

##### Adding Classes and Attributes in Markdown

Jekyll's default Markdown parser is [Kramdown](https://kramdown.gettalong.org/index.html). And the thing I liked the most about Kramdown was its syntax for assigning HTML attributes and classes to [block-level](https://kramdown.gettalong.org/quickref.html#block-attributes) and [span-level](https://kramdown.gettalong.org/quickref.html#inline-attributes) Markdown elements. It would work something like this:

```markdown
A paragraph with an ID.
{: #para}

> A blockquote with a title and a class.
{:title="A title"}
{: .blockquote}
```

Eleventy's default Markdown parser is [Markdown-It](https://markdown-it.github.io/), which does not natively support assigning HTML attributes to Markdown elements. But Markdown-It does support plugins, [and there are a lot](https://www.npmjs.com/search?q=keywords%3Amarkdown-it-plugin&page=0&perPage=20). 

The two that had what I wanted were [markdown-it-attrs](https://github.com/arve0/markdown-it-attrs) and [markdown-it-bracketed-spans](https://github.com/mb21/markdown-it-bracketed-spans). 

```bash
npm install markdown-it-attrs --save
npm install markdown-it-bracketed-spans --save
```

Markdown-it-attrs provided HTML attributes and classes to block-level and inline elements:

```markdown
# header {.big-header}

paragraph *red text*{.red} more text {data-toggle=modal}
```

The above outputs:

```html
<h1 class="big-header">header</h1>
<p data-toggle="modal">paragraph <em class="red">red text</em> more text</p>
```

Markdown-it-bracketed-spans is a plugin for markdown-it-attrs which allows the creation of `<span>` elements within the markdown to add attributes. 

```markdown
paragraph

these [are words]{.green} and more words
```

This becomes


```html
<p>paragraph</p>
<p>these <span class="green">are words</span> and more words</p>
```

To enable this functionality, I updated my config: 

```javascript
import markdownIt from "markdown-it"
import markdownItAttrs from "markdown-it-attrs"
import markdownItBracketedSpans from "markdown-it-bracketed-spans"

export default function (eleventyConfig) {
        const mdoptions = {
        html: true,
        breaks: true,
        linkify: true,
    };
    const markdownLib = markdownIt(mdoptions).use(markdownItBracketedSpans).use(markdownItAttrs, {
        leftDelimiter: '{',
        rightDelimiter: '}',
        allowedAttributes: []
    })
    eleventyConfig.setLibrary("md", markdownLib)
}
```

I created three classes to be used with the Markdown content: `sticky-header`, `sidenote`, and `emphasis` ([examples](https://the-bellwether.meganrenae.me/posts/20260924-bells-whistles#built-in-classes)). I also created classes for image sizes: `large`, `medium`, `small`, and `xsmall` ([examples](https://the-bellwether.meganrenae.me/posts/20260924-bells-whistles#adding-images)).  

##### Adding Internal JavaScript Plugins

My `package.json` has a package "type" of "module", meaning all `.js` files are treated as ESM, rather than CommonJS, which changes the syntax we use. I created a file `js/main.js` that I loaded into the base template before the closing `</body>` tag. 

```html
<script type="module" src="/js/main.js">
```

There were only two scripts I wanted to add: a reading-time script that would tell you how much time it would take the average reader to read a post based on its word count, and a script to create a dynamic table of contents. To see how these work, you can [view this post](https://the-bellwether.meganrenae.me/posts/20260924-bells-whistles) (for the dynamic TOC, make sure you're on a desktop and in landscape mode)[^5].

I created two additional files in the `js/` folder: `reading-time.js` and `toc.js`. In each of them, I wrote the script as an export function:

```javascript
// reading-time.js

export function readingTime() {
    /** script goes here */
}

// toc.js

export function tocSidebar() {
    /** script goes here */
}
```

Then, I imported them into `js/main.js` and ran them:

```javascript
// main.js

import { readingTime } from "./reading-time.js"
import { tocSidebar } from "./toc.js";

readingTime()
tocSidebar()
```

### Redesigning This Site

My experience in making The Bellwether reminded me how fun it could be to build websites from scratch, and I decided to try it again for this site's redesign. 

I kept much of the same config I had from The Bellwether. That gave me a starting point. Then I (again through CodeSandbox) got the basic design figured out. Then I started thinking about what I needed to make this work. 

#### Draggable Modals

Terminals aare generally pretty low-tech. This site has some features that I feel aren't suited well to being displayed in a faux-terminal. For example: embedded CodePens or videos. 

My solution was to display a button that, when clicked, would display a new window, or modal, that would display the embedded content. The user could drag the modal around the screen. 

With shortcodes, the implementation is simple enough, at least in the configuration. You will need to give each modal in a post it's own unique ID. For me that is "modal01", then "modal02", then "modal03", etc...

I set up a shortcode for a button like this:

```javascript
export default function (eleventyConfig) {
    eleventyConfig.addShortcode("modalBtn", function(modalID, text) {
        return `<button class="open-btn" data-open-target="${modalID}">${text}</button>`
    })
    /** add code for shortcode for modal */
}
```

So say I wanted to open a CodePen modal for a pen displaying some CSS artwork of a sunset, I would create a button like this:

{% raw %}`{% modalBtn modal01 "See my CSS Sunset!" %}`{% endraw %}

Then we can add the shortcode for the modal itself. CodePen has a specific code to use for embeds, so there are a few more parameters in this code:

```javascript
    eleventyConfig.addShortcode("codepen", function(user, id, modalID, fullname, pentitle) {
        return `<div class="codepen-modal modal hide-modal" id="${modalID}" data-drag="false"><div class="modal-header"><button class="close-btn" data-close-target="${modalID}"></button><div class="drag-bar" data-drag-target="${modalID}"><hr></div></div><div class="modal-content"><iframe height="600" style="width: 800px;" scrolling="no" src="https://codepen.io/${user}/embed/${id}?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true">See the Pen <a href="https://codepen.io/${user}/pen/${id}">${pentitle}</a> by ${fullname} (<a href="https://codepen.io/${user}">@${user}</a>) on <a href="https://codepen.io">CodePen</a>.</iframe></div></div>`
    })
```

Here, `user` is the CodePen username, `id` is the pen's ID,`modalID` is the ID of the modal element in the DOM, `fullname` is the name of the user, and `pentitle` is the title of the pen. 

In `main.css`:

```css
.hide-modal {
    display: none !important;
}
```

This ensures that the modal remains hidden, at least until I click the button. 

I write the code for the functionality of the modals in `scripts/embedModals.js` then import it into `scripts/main.js`, which is loaded into my base layout before the closing `</body>` tag: `<script type="module" src="/scripts/main.js">`.[^6]

##### Comments Modal

I use a quick and easy commenting tool [komments](https://komments.cloud), which creates a site where comments can be made and are stored. This site can be embedded. I decided that would be something else that could be useful for a draggable modal. 

I already use a `comments_url` frontmatter property for the commenting site to embed to each post. I added a snippet to my `base.njk` layout that checks if that property has been added:

{% raw %}
```njk
{% if comments_url %}
    {% modalBtn "comments-modal", "Comments" %}
    {% comments %}
    {{ comments_url }}
    {% endcomments %}
{% endif %}
```
{% endraw %}

I create a new modal button that will open a modal with the ID `comments-modal`. The {% raw %}`{% comments %}`{% endraw %} block is actually a paired shortcode I created for the actual draggable comments modal. Paired shortcodes allow you to nest in variables -- in this case `comments_url`. 

#### Syntax Highlighting

My preformatted codeblocks (the ones in the `<pre>` tags) were looking pretty plain so I decided to check out the official Eleventy [Syntax Highlighting Plugin](https://www.11ty.dev/docs/plugins/syntaxhighlight/). This plugin allows for PrismJS syntax highlighting, using any theme available for Prism. 

[Prism's website](https://prismjs.com/) only listed a few themes and I wasn't super impressed with the selection, but I decided to search "Prism Theme" on Github and the community had me covered. 

Shout out to this [VS Code to Prism theme converter tool](https://prism.dotenv.dev/)[^7]. This allowed me to take **any** theme from Visual Studio Code (or VS Codium) and create a stylesheet that worked with the plugin. 

This is a build-time plugin, meaning there are no JavaScript files provided for the browser to load. However, to get the labels (on the top right corner of the codeblocks) to work the way I wanted, I had to add my own scripts and a little of my own styling. 

### Things I Didn't Mention

- Additional Markdown-It plugins:
    - [Footnotes](https://mdit-plugins.github.io/footnote.html)
    - [Container](https://mdit-plugins.github.io/container.html)
- [Atom/RSS Feed](/feed.xml)[^8]
- My drafts workflow[^9]
- [Webmentions](https://webmentions.io)[^10]
- Using global data files to:
    - Create a blogroll
    - Create a row of social media icons
- Setting up [pagination to navigate](https://www.11ty.dev/docs/pagination/nav/) through the blog

### Footnotes

[^1]: You can find the [demo here](https://the-bellwether.meganrenae.me/) and the [source code here](https://github.com/meganrenae21/the-bellwether).

[^2]: There are extensive resources on using Collections in 11ty, starting with the [documentation itself](https://www.11ty.dev/docs/collections/). The linked page has information on collections using the "Tags" property, but if you scroll down you will find a list of numerous blog posts via [11tybundle.dev](https://11tybundle.dev) with more information from the community. 

[^3]: And don't even get me started on [paired shortcodes](https://www.11ty.dev/docs/shortcodes/#paired-shortcodes).

[^4]: This has been labeled a [common pitfall](https://www.11ty.dev/docs/dates/#dates-off-by-one-day) in the Eleventy docs.

[^5]: Also view the complete code for these at the Github repo: [reading-time.js](https://github.com/meganrenae21/the-bellwether/blob/main/js/reading-time.js) and [toc.js](https://github.com/meganrenae21/the-bellwether/blob/main/js/toc.js)

[^6]: I wanted to keep from getting into the full JavaScript tutorial, but you can see the script [here](https://github.com/meganrenae21/meganrenaedotme/blob/main/src/scripts/embedModals.js).

[^7]: [Repository link](https://github.com/SaraVieira/prism-theme-converter)


[^8]: From the [Eleventy RSS Plugin](https://www.11ty.dev/docs/plugins/rss/)


[^9]: This was pretty much taken verbatim from [the example from the Eleventy docs](https://www.11ty.dev/docs/config-preprocessors/#example-drafts)

[^10]: Technically not an 11ty thing, but new to the site so it counts, I think.