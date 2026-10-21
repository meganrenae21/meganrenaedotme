---
layout: post.njk
title: "How I built a simple static blog with org-mode"
date: 2020-08-11
note: orgblog
permalink: posts/blogging-with-org-mode
comments_url: https://komments.cloud/0a1318afb4638ad51e8e68
tags: [orgmode, emacs, webdev]
---

There's always something new to discover with Emacs and org-mode, and building a blog was my way of wading into deeper waters - no longer content to just get my feet wet.

And then there's org-mode[^1], and all of its customization options and packages[^2], and after playing around a bit I asked myself: *is there anything I can't do from here?* I began using org-mode as a simple orgnization system and going through example setups and tutorial, noticing that many of the blogs and sites I was getting information from were themselves *written in org-mode*. And since I learn things best by doing projects I get really passionate about, I decided to give it a go and create my own static site blog with org-mode, which I would host on Github pages. 

That's how I became obsessed. 

What follows is an abridged step-by-step summary of my process in creating a very basic framework for a static[^3] site blogging framework, which I am using for this blog. 

### Starting points and goals

I use [Spacemacs](https://www.spacemacs.org/), which is not a separate piece of software; rather, it is a specific emacs  configuration for organizing and using emacs (to put it in the most simple terms). I also have access to all the built-in functionality of org-mode, and, if necessary, whatever package extensions I would need to get started. I realized that, given the right packages, there was very little that *couldn't* be done.

Yet, installing packages left and right carried the risk of overreliance on external packages, and a lack of confidence in my own ability to find creative resolutions outside of fancy extensions. So I made a few flexible ground rules for myself with this in mind:

- I would use, as much as possible, the built-in functionality of org-mode, including org-publish and the org exporters, and would not use an external static site generator package[^4].
- I would build a framework that took advantage of org-mode functions while also allowing myself to *not* use methods that existed if they didn't suit my needs. 
- I would not be restricted to solely using org-mode. I had to remind myself that there could be built-in or external emacs packages that weren't specific to org, but could be easily integrated into my workflow. 
- It didn't have to be perfect or do *every little thing* I'd like to be "live"; this was a project that could be continuously in development, with features/functionality added as I learned more. 

I'm going to reiterate here, **I'm a complete newbie**. I know very little emacs-lisp, I've only been playing around in emacs for a little over a month, and this build is based on what I've mastered *so far*. There are certainly aspects that could have been made a lot easier by using already-established solutions for a lot of my issues, but what fun would that be? I wanted this to be a fun, discovery process where I could figure things out, largely by my own tinkering and experimentation. So, please, if you are an emacs and org-mode master, be kind. 

### Initial file framework

The best resource I found at the beginning of this endeavor was an [org-publish tutorial](https://orgmode.org/worg/org-tutorials/org-publish-html-tutorial.html) on [Worg](https://orgmode.org/worg/index.html), a subsection of the official  org-mode website maintained by the community of org-users that is an invaluable tool in learning all that you can do with org-mode.

Using this tutorial as a guide, I created two folders within my main project folder: `~/org/` and  `~/public_html/`. The idea is that my input would be under the  `~/org/` directory, and whatever was in that directory would be exported to html and published in the `~/public_html/` directory. 

After that, I left the `~/public_html/` folder alone, as any files and subdirectories should be created during the publishing process. Any changes I would make to the final html version of the files would be done in the org version. 

Additionally, since *anything* in the `~/org/` directory would be exported (unless I specifically configured a certain file or headline not to be exported), it wasn't restricted to simply *org* files. Simply put, any file at all that I wanted to eventually wind up in `~/public_html/` would be placed within `~/org/`. 

First, I created `index.org` within `~/org/` and then I created several folders (subdirectories) that would eventually carry files of their own. This was my initial file organization for this blog:

```plaintext
.
├── public_html/
└── org/
    ├── index.org
    ├── img/
    ├── posts/
    └── css/
        └── style.css
```

With this setup, `index.org` would become `index.html` under the `~/public_html/` directory. Additionally, `~/org/css/style.css` would be exported to `~/public_html/css/style.css` so I could apply a consistent style to exported HTML files. The `img/` directory would carry images and other attachments, while all posts would go into the `posts/` folder for export. 

Note, that if, in editing an org file within the `~/org/` directory, if I were to link to another org file within `~/org/`, the exporter would then transform that link into a link to the corresponding file in `~/public_html/`. Likewise, by applying `/css/style.css` to `index.org`, the `~/public_html/index.html` file resulting from the export would be loaded with a stylesheet in `~/public_html/css/style.css`. 

### The `export.el` file

Once I got some basic files set up under this framework, I needed to perform an initial export test to ensure that this would work as planned. Instead of creating my project configuration under my main emacs config file, I decided to use a separate file, `~/export.el`, which I placed in my *root* (even with, and not under, `~/public_html/` and `~/org/`). 

The first line is `(require 'ox-publish)` which I use to ensure that emacs loads the ox-publish library when publication is triggered. After that I set the variable `org-publish-project-alist` to define my project scope. 

First, I provide a list of components ("blog-posts", "blog-pages", and "blog-static"), and then I compile those components (and all of their settings) into the "blog" project. So it goes like this:

```elisp
    (setq org-publish-project-alist
       '(("blog-posts"
          :base-directory "org/posts/"
          :base-extension "org"
          :publishing-directory "public_html/posts/"
          :recursive t
          :publishing-function org-html-publish-to-html
          :org-html-preamble nil
         )
         ("blog-pages"
          :base-directory "org/"
          :base-extension "org"
          :publishing-directory "public_html/"
          :recursive t
          :publishing-function org-html-publish-to-html
          :org-html-preamble nil
         )
         ("blog-static"
          :base-directory "org/"
          :base-extension "css\\|js\\|png\\|jpg\\|gif\\|pdf\\|mp3\\|ogg\\|swf"
          :publishing-directory "public_html/"
          :recursive t
          :publishing-function org-publish-attachment
         )
         ("blog"
          :components ("blog-posts" "blog-pages" "blog-static"))
    )
```

Now, I have several other options set up in `export.el` but have narrowed down what I felt were the most important for me to get this page set up how I want it. Let's take a closer look at the three components and the settings I gave them above.

#### Components

- **blog-posts:** these are all the posts that will be published to the blog. I've given them a separate component because the configuration for these files could potentially differentiate from what's in "blog-pages", and I think it's better to keep each part of the site separate as much as possible.
- **blog-pages:** so here we're going with every org file within the `~/org/` directory[^5].
-   **blog-static:** for all files included in the `~/org/` directory that *aren't* org files, and should keep their native extension upon export.
-   **blog:** this gives us all these separate components, and puts them together into one project.


#### Options

- **base-directory:** this is the directory where the files are coming *from* - in this case `~/org/`
- **publishing-directory:** the directory where the files are going to be published *to* - `~/public_html/`
- **base-extension:** tells the exporter to export files with this(these) extensions. For pages and posts, the files exported will end in `.org`, but for the static files, the base extension has multiple possibilities.
- **publishing-function:** this tells the back-end how to publish these files. I need to publish everything that's an org file as an html file, so I set `blog-posts` and `blog-pages` with `org-html-publish-to-html`. Meanwhile, anything in the `~/org/` directory that doesn't end in `.org` (`blog-static`) should just be copies into the desination folder using `org-publish-attachment`.
- **recursive:** tells the exporter whether to include files from subdirectories recursively, or just from the parent directory. This has two possible options: `nil`, meaning just use the parent directory, or non-nil (typically `t` is used), which means to also include subdirectories.
- **org-html-preamble:** this was important for me to set as `nil` to ensure that the exporter did not include a preamble, something that is included at the top of each file. While the preamble can be customized to suit your needs, I preferred not to mess with it and used a templating method instead (which I will go into later).

Now that I had my `export.el` file configured the way I wanted it and some dummy posts and pages set up to see how it looked, I could go ahead and publish. To do so, I placed my cursor after the ending parenthesis on the first line of the file (`(require 'ox-publish)`), and pressed `C-x C-e`[^6]. Then I navigated to the end of the file, after the last ending parenthesis on the last line, and pressed `C-x C-e` again. This will evaluate the emacs-lisp code in the file. After that, all I had to do to execute was to press `M-x org-publish-project` which would list all the components in the minibuffer. I could then navigate down to select "blog" and press the `return` key. Afterward, I could find the resulting exported files and folders in the `~/public_html/` directory. 

### Adding style and usability

So now that I knew how to export an entire static website via org-mode, the question was: *how do I get it to look how I want it to and behave how I need it to?* I had a list of problems I needed to solve to brainstorm ways to fix them:

-   Custom CSS stylesheet
-   A tagging/category system for posts
-   A custom header with custom links
-   An index page that would contain my most recent posts
-   A sitemap or archives page that would contain past entries

So let's talk about the solutions I've implemented so far. 

#### Export templates

While I already selected certain export options within `export.el`, I could also set options within specific files using properties dictating how the files would be exported[^7]. That meant I could create export templates that could then be associated with whatever files I wanted. 

I created a new folder on the same level as `~/org/` and `~/public_html/` called `~/org-templates/` and added two files: `level-0.org` and `level-1.org`. This was the level-0 file:

```org
    #+options: html-link-use-abs-url:nil html-postamble:nil html-preamble:nil
    #+options: html-scripts:t html-style:nil html5-fancy:t tex:t
    #+options: tags:t title:nil toc:nil num:0 date:t
    #+html_doctype: html5
    #+html_container: div
    #+html_head: <link rel="stylesheet" type="text/css" href="css/style.css" />
    #+creator: Megan Renae
```

The `level-1.org` is exactly the same except the stylesheet link goes back a directory, becoming `"../css/style.css"`. 

Here are the important bits:

-   No, I don't want the exporter to insert org's own postambe and preamble
-   No, I don't want to use the default stylesheet
-   Yes, export posts with tags (in the end, I didn't need this at all, as I decided not to use tags, but the option remains)
-   No, don't export the `#+TITLE` property with the file (I add the title myself through headlines)
-   Use the HTML5 doctype
-   Use `div` as the primary container for content
-   Insert my custom CSS stylesheet into the `head` of the document
-   No, don't insert a table of contents with each file
-   No, don't number sections on the file
-   Yes, please export with the date

I added the path to the template file at the top of each page with the #+SETUPFILE property:

```org
    #+SETUPFILE: ~/org-templates/level-1.org
```

#### YASnippet

Org-mode allows creation of special blocks that are written between lines that start with `#+BEGIN_XXXXX` and end with `#+END_XXXXX`. In particular, to include HTML code within an org-file, you can use the lines `#+BEGIN_EXPORT html` and `#+END_EXPORT`. 

I created a snippet to use for blog posts, and after adding the `#+SETUPFILE`, I wrote a very simple code to ensure my blog header was added to each new post. My blog post snippet, then, begins like this:

```org
    #+SETUPFILE: ~/org-templates/level-1.org
    
    #+BEGIN_EXPORT html
    /code for my HTML header/
    #+END_EXPORT
```

**I could create custom fields so each post had defined properties**

Essentially, when beginning a new post, I was filling out a form, with each field providing more specific information about the post. There were five properties I felt were important to include:

- `#+TITLE` :: The title of the post, which was *mirrored*[^8] in the first-level  headline of the content of the post.
- `#+CATEGORY` :: The category of the post, which would then be mirrored in a custom link created at the bottom of the entry that would lead back to the category's (though I used the word "tag") index page, which would have a list of all entries under that tag.
- `#+DATE` ::  Automatically updated with the date the template was first inserted into the file. This isn't ideal, and I realize this would be better to instead be the date of publication. Hey, I never said this was perfect. 
- `#+FILENAME` :: This is just the name of the file without the =.org= extension, and it's mirrors are used to create backlinks that will appear in the index page and the category page. 
- `#+EXCERPT` :: Generally, just the first paragraph of an entry. This is used to create the "preview" text that will appear in the index page. 

Here's what this part looks like in practice:

```org
#+TITLE: ${1:title}
#+CATEGORY: ${2:category}
#+DATE: `(format-time-string "%F")`
#+FILENAME: ${3:filename} 
#+EXCERPT: ${4:excerpt}

=* $1=
**`(format-time-string "%A, %B %d, %Y")`**

$4
$0
=/Tagged: [[../tags/$2.org][$2]]/=
```

The fields are formatted as `${X:placeholder}`, with X being the number of the field, and "placeholder" being the text to be updated. Mirrors are given with `$X`. This also involves custom timestamps, and the values for the symbols used can be found in the [GNU Emacs manual](https://www.gnu.org/software/emacs/manual/html_node/elisp/Time-Parsing.html). 

**I could create backlinks with headline entries that I could refile to a tag index and to a custom sitemap**

Notice that in the previous block I included a link at the end of the entry to a tag index which would then display all entries with the same category. Well, this is where that magic happens. 

Now, `org-publish` does come with its own sitemap and index features, which have served plenty well on plenty of org-based websites. And I still may implement one or both of these features on this blog in the future. That said, I chose to use backlinking to create a poor-man's indexing process. 

The key here is the `org-refile`[^9] function, and that requires the pages that I'm using to be refiling targets to be included in the  `org-refile-targets` variable, which I ended up defining in my personal configuration file. For purposes of this site, the setup is something like this:

```elist
(setq org-refile-targets '(org-agenda-files . (:maxlevel . 9)))
(setq org-reverse-note-order t)
```

I've turned on `org-reverse-note-order` so that newer entries would appear at the top of the indices. I can add any file to `org-agenda-files` by visiting it and pressing `C-c [`. With this configuration any headline within an agenda file (up to the 9th level) is a refile target. This leads me to the last section of my blog post snippet:

```org
=* [[../posts/$3.org][$1]]=
`(format-time-string "%D %a")` ;; this is the refile headline in the tag indexing

=* [[./posts/$3.org][$1]]= || `(format-time-string "%D %a")`
/[[./tags/$2.org][$2]]/
$4
[[./posts/$3.org][Read more...]] :: this is refiled to the sitemap
```

This creates more mirrors from the fields that were defined earlier in the snippet. Now I just need to run the command `org-refile`, select the correct target, and these headlines will be placed in their correct place.

One problem, though... where is that?

#### Refining the structure

Let's go back to the very beginning, when I created an `index.org` file, the first file of my `org-publish` project. It's time to finalize that page by giving it our sitemap. To do this, I create a new file under `~/org/`, `sitemap.org`, which I add as an agenda file.  This is the file that I will end up using to create the list of posts in anti-chronological order that will appear in my `index.org` page.

To start, `sitemap.org` will have a single first-level headline, "Latest Posts". Then I will refile the headline created with my blog post snippet to the sitemap file, and it will show up as the first entry. Now I go back to `index.org` so I can include the latest posts from `sitemap.org` on my blog's front page. To do this, I can use the `#+INCLUDE` property, like this:

```org
=#+INCLUDE: "~/org/sitemap.org"=
```

That's a good start, but since the sitemap is going to house ALL files from the blog's history, I don't want to include the *entire* sitemap in my index page. Luckily, there's a way to limit what lines will be included. 

Let's look back at the entry we've refiled to `sitemap.org`:

```org
=* [[./posts/post.org][Post Title[]]= || XXXX-XX-XX XXX
/[[./tags/tag.org][category]]/
POST EXCERPT
[[./posts/post.org][Read more...]]
```

Since Emacs doesn't automatically create new lines, I know that each entry in `sitemap.org` will be exactly 4 lines. The actual sitemap will begin on line 2, after the "Latest Posts" headline. Say I want to include the last five posts in my index page; all I need to do is calculate how many lines that would be. 

In this case, 5 posts would be 20 lines. Since we're starting on line 2, we know the last line we'll need to use is line 21. However, when we include line numbers in the `#+INCLUDE` line, the last line given is excluded, so we'll need to add one more to ensure the last post doesn't get cut off early. 

This is what we end up with:

`#+INCLUDE: "~/org/sitemap.org" :lines "2-22"`

Now, there's one more thing: individual pages for each category or tag. I've already laid the groundwork with out snippet and the post, at the very end, contains a link to the category page under a new subdirectory I've created: `~/org/tags/`. I can click that link when I'm done writing my post, and it will take me to a new buffer containing the category/tag index page. If it's a new category, and therefore no page has been created yet, it will create a new buffer with a completely blank file and all I need to do is insert a headline (`* TAG: CategoryName`), press `C-x C-s`, and just like that the file is created. By pressing `C-c [`, the new file is added as an agenda file. Then, I can refile the corresponding headline to add a new entry to the tag page. 

### Final touches

Now that I have built the framework I need for this to work correctly, there are only a couple of things left before going live. The obvious one is to create an About page, which is self-explanatory, along with an Archives page for past entries (for which I use the same re-filing method I explained above with tags), and a Caategories Page to link to all of the individual category indices.

No, this isn't exactly finished. I'll be continuously working on this blog, whether that means to add something else, or to change things around, just to keep it in sync with my org learning curve, as well as my changing tastes and needs. I'd still like to implement an Archives page. I know that using ya-snippet in the way that I have can provide some difficulties when it comes to retroactive changes, so I'm trying to isolate individual elements in separate files to make implementing changes easier. I'm also using [Magit](https://magit.vc/) for version control. 

In short, this is a work in progress - just like me.

### Footnotes

[^1]: Explaining Org-mode succinctly is even more of a lost cause than Emacs, so just [go here](https://orgmode.org/) if you're curious.

[^2]: software in software in software

[^3]: a static site is basically a website built from HTML files, as opposed to a dynamic site where a webpage is built on the server pulling resources from several different locations. On a static site blog, when you click on a link to a post or page, you're served a page that has already been built in the file system. On a dynamic blog (built with Wordpress, for example), each request builds a page from scratch based on current site data and content. Confused? [This may do a better job of explaining](https://learn.cloudcannon.com/jekyll/why-use-a-static-site-generator/)

[^4]: Don't get me wrong, I think these packages look awesome. [Here's a pretty good list.](https://orgmode.org/worg/org-blog-wiki.html). Please don't think I won't take advantage of these in the future - I'm sure I will. They just weren't right for *this* project. 

[^5]:  A little caveat here: I ended up setting this to recursive, which means all files are technically included in this component, which could cause an issue as the files in the `/posts/` directory are included in `blog-posts`. This hasn't caused an issue for me yet, and my main decision for doing so would be to include the `/tags/` directory. However, looking at this now I realize it would make more sense to add `blog-tags` as a separate component.

[^6]: Remember emacs using the control and meta keys, and these are shorted to "C" and "M" when written out. When used with a hyphen and then another letter, this would mean to press the command key (control or meta) and the corresponding letter at the same time. In this example, `C-x C-e` means to press the Control key at the same time as "x", let go, then press the Control key again, at the same time as "e" on the keyboard.

[^7]: As always, for more information, check out the [org manual](https://orgmode.org/org.html#Export-Settings).

[^8]: In ya-snippets, *mirrors* can be placed anywhere in the template, and they are updated with the value of their primary field. 

[^9]: Org-refile is more of an organization thing, and less of a publication thing, and I've just manipulated its use here for my purposes. However, to know more about how it's *supposed* to be used, again, [check out the org manual](https://orgmode.org/manual/Refile-and-Copy.html#Refile-and-copy).