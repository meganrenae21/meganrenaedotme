---
layout: post.njk
title: "From org to Jekyll:  A New Beginning"
date: 2025-06-28
permalink: posts/org-to-jekyll-new-beginning
tags: [jekyll, blogging]
comments_url: https://komments.cloud/79bf7f36f98c683267a4b9
---

It's been nearly five years since I published my first blog post using org-mode. While I loved the novelty of using org-mode to create a publish a static website and blog, and I'm proud that I was able to figure out how to make it work (at least in theory), it ended up being a bit too high-maintenance for me on a practical level. My resolve to DIY my blog from the ground up ended up being its undoing. 

So now I'm going again, this time using [Jekyll](https://jekyllrb.com). Jekyll was an easy choice. I'm familiar with the platform (my knowledge database, [megan-zk](https://megan-zk.netlify.app/), is written with Jekyll), it's got a wide user base and extensive documentation, and it's flexible enough that it can be custommized to just about any purpose. 

Mostly, though: Jekyll is easy and quick. My experience with maintaining my blog using org-mode taught me the importance of choosing a platform that allowed me to focus on the important things. 

### So, was the org blogging experiment a failure?

Short answer: No.

Long answer: No. My org-mode blog, [Meg in Progress](https://meganrenae21.github.io/Meg-in-Progress/), was a learning experiment. That was what I had intended for it to be, and to that end, it was successful. 

And look, there's nothing *wrong* with using org-mode as a blogging engine. [Plenty of people have made it work for them](https://orgmode.org/worg/org-web.html). And clearly, once I had gotten it up and running, it was working for me -- at least for the *four* posts I published to Meg in Progress between August 2020 and March 2021. 

When I decided to get back to blogging earlier this month, I wanted to use org again. The first thing I did was attempt to revamp the site as a whole, and I quickly ran into issues. 

To start, org's HTML export options are highly configurable, but I found it to be incredibly troublesome to manipulate the top-level HTML files so that my custom elements would be inserted exactly how and where I needed to be on the page. 

I wanted to add a footer element to the site. This footer would appear at the bottom of each page on the site. I used the HTML export option `org-html-postamble` to achieve this. 

The problem was that I wanted the footer to be *inside* the main `<div id=content>` which included the actual post (or page) content.

This is how I wanted it to look:

```
<div id="content">
  <div class="header_containter">
    <div class="header">Meg in Progress</div>
    <div class="nav">
      <a class="navlink">about</a>
      <a class="navlink">archives</a>
      <a class="navlink">tags</a>
      <a class="navlink">home</a>
    </div>
  </div>
  <div class="post_header">
    <div class="post_title">An example title</div>
    <div class="post_date">XX/XX/XXXX</div>
    <div class="post_tags">
      <a class="taglink">tag</a>
      <a class="taglink">another</a>
    </div>
  </div>
  <div class="post_content">
    ...post...
  </div>
  <div class="footnotes">
    ...footnote section...
  </div>
  <div class="footer">
    Custom footer / org postamble element
  </div>
</div>
```

Notice how the content container isn't closed until after the footer is inserted, but the footer is not contained in any *other* element. 

At first, instead of the postamble, I used a custom `include` block to export the footer. But when I included the footer at the end of each page and post exported, it ended up like this:

```
<div id="content">
... post content here...
  <div class="footnotes">
  ... some footnotes ...
    <div class="footer">
      footer here
    </div>
  </div>
</div>
```

The footer was being *inside* the last element/section of each post, rather than on its own within the top-level container. 

I thought using the postamble export option would fix this. Instead, this was the result:

```
<div id="content">
  ... post content here ....
</div>
<div class="postamble">
  footer here
</div>
```

This time, the footer ended up *outside* the content container, which wasn't what I wanted at all. The idea was that all the content that would appear on each page would within a parent container, in which I could use CSS `display: flex` to easily align and justify the elements within that box. 

I understand that I could tinker with the export options via trial and error to figure out how to make it work. I could remove the parent container altogether, and apply `display: flex` to the `<body>` element. I could use the `org-html-preamble` option to create my custom header, rather than an import statement, so both the footer and the header would be positioned *outside* the container. My issue was not that org-mode didn't allow me to do what I wanted. 

The issue was that the time and effort it took to get it right subtracted from the time I had available to actually write. Creating substantive content is the entire purpose of keeping a blog in the first place. 

Another issue was that it was backwards enforcement of any the textual format of certain template elements. I used `ya-snippets` to create templates, and once a snippet was created, the content of that snippet was not dynamic. 

Just take a look at how the first three posts I wrote for [Meg in Progress](https://meganrenae21.github.io/Meg-in-Progress/) appear on the index page:

> #### What the Latest Impreachment Trial Says about the Current State of US Politics
> **02/27/21 Sat**  
> On the weekend before Last, the US Senate concluded the second impeachment trial of former president Donald Trump, who had been impeached for inciting the insurrection at the US Capitol on January 6.. <span class="fake_link">Read more…</span>  
> <span class="fake_link">politics</span>
> 
> #### Blogging with Org Mode: An Update
> **Saturday, August 22, 2020**  
> In my <span class="fake_link">last post</span>, I went over how I set up this blog solely in org-mode. And since that post has been published, I've made a few more changes to the configuration and so, in an effort to provide the most up to date information, I figured I'd write a little addendum. <span class="fake_link">Read more…</span>  
> <span class="fake_link">dev</span>
> 
> #### How I built a simply static blog with org-mode || 08/11/20 Tue
> <span class="fake_link_2">dev</span> There's always something new to discover with emacs and org-mode, and building a blog was my way of wading into deeper waters - no longer content to just get my feet wet. <span class="fake_link">Read more…</span>  

As you can see, it's a mess of inconsistency. Changes made to the snippet don't update the snippets that have already been applied. If I want to make a formatting change that will apply across *all* entries, including past entries, I would have to manually go back and change each post. Perhaps in time I could have figured out a solution, which brings me back to the previous point: it's *time* I'm saving by moving to Jekyll.

### More blogging, less troubleshooting

As a developer, I'm all too familiar with the process of constantly adapting and fixing your code when it breaks or throws out results you didn't expect. I know that, with a blog created with a static site generator, *some* technical fine-tuning will always be necessary. 

As a blogging platform, Jekyll makes life *a lot* easier by offering several tools for the technical process:

- Templates and includes allow you complete control over the HTML. Everything on each page and post is laid out exactly like I set it up. I can update styles without getting unexpected results. 
- YAML frontmatter and data files used alongside the [Liquid templating language](https://shopify.github.io/liquid/) keep pages and posts formatted consistently across the site. 
- Extensive documentation and a huge userbase means that there are numerous resources available for any updates I want to make or any technical issues I may be having. 
- A stockpile of available themes and plugins can help to instantly implement new features to a site.
- It is incredibly simple and fast to get up and running, even without a theme, and you can easily integrate your own CSS and javascript files. 
- [Painless deployment](https://jekyllrb.com/docs/deployment/) to the back-end platform of your choice. This blog uses [Netlify](https://www.netlify.com/) which builds the site each time I push a new commit to this blog's [Github repository](https://github.com/meganrenae21/blog). 

This is not to say that Jekyll offers every single thing I wanted right out of the box. While its builds the site from source, convering markdown (.md) files to HTML, Jekyll doesn't create new pages from scratch. This means that I have to create monthly archive pages and tag pages myself whenever I create the first post in a particular month or use a tag for the first time. What I *don't* need to do, though, is update those pages each time I make a new post. Archive lists are created programmatically through the liquid templates. Every post with the tag "jekyll" will show up in the tag page for [jekyll](./tags/jekyll.html), provided the page exists. Every post from June 2025 will show up in the corresponding [June 2025 archive page](./archives/2025/june.html) -- again, provided the page exists. The markdown source for these tag and archive pages is completely empty except for two lines of YAML frontmatter:

```
---
title: 
layout: 
---
```

The *layout* is the file in the source `_layouts` folder that serves as the HTML template for the page, and the *title* is used to pull all posts with that tag or from that month. 

There is a [plugin](https://github.com/pattex/jekyll-tagging) for a simpler implementation of tags. I could also write a script in Python that would generate pages for me. I may do this in the future. However, it's hardly any trouble to manually add a new page with the required frontmatter whenever I need to--and that way I don't have to worry about any additional scripts or plugins breaking. It keeps things light-weight.

### What next?

I plan to keep contributing to this blog, and making changes as I go along. I don't really have any major plans for the blog itself for the time being. I had considered adding a comment system, but I don't have the readership for that right now. 

I see this site as a way to share information about various projects I'm working on and the things I'm learning. I want to focus primarily on publishing good, substantive content worth reading. 