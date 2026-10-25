---
draft: true
layout: post.njk
title: "Third Iteration: Welcome to My 11ty Terminal"
date: 2026-10-23
permalink: posts/third-iteration-my-11ty-terminal.html
tags: [eleventy, blogging, webdev]
---

It has been a year since my last post, and I have ([again](posts/org-to-jekyll-new-beginning/)) decided to revamp this space. This time I've moved over from [Jekyll](https://jekyllrb.com) to [Eleventy](https://11ty.dev). And now I'm going to tell you how and why. 

### Why Eleventy?

The main thing I realized that Eleventy offered was more flexibility over my workflow. While Eleventy is zero-config by default, it runs on Node.js/JavaScript, and I am comfortable adjusting my own configuration and plugin settings. Jekyll runs on Ruby, which is not a language I'm familiar with, and has a more opinionated ecosystem. 

With Eleventy, I was not locked in to a single templating language or directory structure. Jekyll uses the template language [Liquid](https://shopify.github.io/liquid/), which I found simple enough to learn. Eleventy offers Liquid as a default as well, though I went for [Nunjucks](https://mozilla.github.io/nunjucks/), which is a very similar templating language to Liquid but one that allows you to call JavaScripts functions on variables. 

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
        <a class="list-post-tag" href="{{ paths.tagDir }}{{ tag }}.html">{{ tag }}</a>
        {%- endfor -%}
        {%- endif -%}
    </p> 
    {%- endfor -%}
</div>
```
{% endraw %}



### Footnotes

[^1]: You can find the [demo here](https://the-bellwether.meganrenae.me/) and the [source code here](https://github.com/meganrenae21/the-bellwether).