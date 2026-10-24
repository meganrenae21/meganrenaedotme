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

### Footnotes

[^1]: You can find the [demo here](https://the-bellwether.meganrenae.me/) and the [source code here](https://github.com/meganrenae21/the-bellwether).