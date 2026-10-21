---
layout: post.njk
title: "Blogging with Org-Mode: An Update"
date: 2020-08-22
note: orgblog
permalink: posts/org-mode-blog-pt-2.html
comments_url: https://komments.cloud/eb583a215ac590da0064d7
tags: [orgmode, emacs, webdev]
---

In my [last post](/blogging-with-org-mode/), I went over how I set up this blog solely in org-mode. And since that post has been published, I've made a few more changes to the configuration and so, in an effort to provide the most up to date information, I figured I'd write a little addendum. 

### Comments

I wanted to add a comments section to entries. I really didn't want to put much effort into this...just a simple box to respond to posts. It turned out that [utterances](http://utteranc.es) provided me with something that was easy to set up and visually appealing. The only issue is that in order to comment, you have to be signed in to [github](http://github.com). Since my site is hosted on github pages, though, this seems like an okay compromise.

I chose utterances because each comment section will be self-hosted on this site's repo, it was simple to set up, and while people have to log in to leave comments, I preferred that to allowing "guest" comments. Since internet comment sections have a reputation for being toxic hell-scapes, I wanted to ensure commenters have a stake in what they say. As much as I am an advocate for free speech, I don't want to provide a platform where people are enabled to evade responsibility for what they say. 

Facebook comments was out because I am not going to force people to use their real names to comment. Disqus would be the obvious choice, or any number of third-party systems. I wasn't inclined to go down that road, mostly because of privacy issues. I don't want data gathered from user comments on my site to be sold by a third party to advertisers. If I expect commenters on my posts to take responsibility for their words, I have a responsibility to ensure an open discussion forum doesn't turn into a for-profit opportunity for anonymous corporations. 

It was incredibly easy to set up. All it involved was to install the utterances app on my blog repo, then paste a code snippet to my post template. If you'll recall, I am using YASnippet as a templating tool for my blog posts. That said, I didn't add the code directly into my post snippet. Instead I added a new directory, `~/org/src/` where I created an `utterances.html` file with the code in question. Then I simply included the file in my snippet to be exported as html:

```
#+INCLUDE: "../src/utterances.html" export html
```

### Templating Update

Another change I made I started to touch on in my last post, and that has to do with my yasnippet "snippets". I mentioned that including actual code within my ya-snippet file created an issue if I were to make changes to my blog template after the fact. Because of this, I decided to completely revamp my post snippet so that the build of each post is made mostly from external files. Here's an example of what I'm talking about:

```
#+BEGIN_SRC html
#+SETUPFILE: ../org-templates/level-1.org
#+INCLUDE: "./src/header.html" export html

#+TITLE: ${1:Title}
#+CATEGORY: ${2:Category}
#+DATE: `(current-time-string)`
#+FILENAME: ${3:filename}

=* $1=

#+INCLUDE: "../../content/$3.org"

#+INCLUDE: "../src/utterances.html" export html
#+END_SRC
```

Notice that, in addition to the `SETUPFILE`, I have added three different `INCLUDE` files to export as blocks. 

+ `header.html` :: previously this was part of an export block included directly in the snippet. The code hasn't changed; it's just housed elsewhere.
+ `/content/` directory :: this was the solution to my date problem that I mentioned in my previous entry. Basically, posts should be dated according to when they were published, not when I started writing them. One solution would be to use the org exporter's {% raw %}`{{{DATE}}}`{% endraw %} macro, which assigns a date when the file is exported, but I wanted to ensure the date wouldn't change if I needed to republish a file for any reason. So, I decided the best thing to do would be to house the actual blog content in a separate file, to be included in the post file, so the date would only be calculated when the snippet was inserted into the post. The idea is to only create a post for export when it is ready to be published. 
+ `utterances.html` :: I explained this above.

### To conclude

As I said in my the previous post, this blog is, and will continue to be, a work in progress. Still, I probably won't go over every single change or update I make to the configuration and templating system in the future. Instead, I'll focus on figuring out what kind of content to put on here. I'm barely a programmer or developer -- I would call myself a creative, and the purpose of this blog is to share some of my story and my process with the world. Stay tuned!
