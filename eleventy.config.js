import markdownIt from "markdown-it"
import markdownItAttrs from "markdown-it-attrs"
import markdownItBracketedSpans from 'markdown-it-bracketed-spans'
import { footnote } from "@mdit/plugin-footnote";
import { container } from "@mdit/plugin-container"
import { DateTime } from "luxon";
import YAML from "yaml"
import { feedPlugin } from "@11ty/eleventy-plugin-rss"

export const config = {
    dir: {
        input: "src",
        includes: "_includes",
        layouts: "_layouts",
        data: "_data",
        output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["html", "njk", "md"]
}

export default function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/*.ico");
    eleventyConfig.addPassthroughCopy("src/*.png");
    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addPassthroughCopy("src/scripts")

    eleventyConfig.addGlobalData("permalink", () => {
        return (data) => 
            `${data.page.filePathStem}.${data.page.outputFileExtension}`
        });
    eleventyConfig.addUrlTransform((page) => {
        if (page.url.endsWith(".html")) {
            return page.url.slice(0, -1 * ".html".length);
        }
    });
    eleventyConfig.configureErrorReporting({ allowMissingExtensions: true })

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

    eleventyConfig.addDataExtension("yaml", (contents) => YAML.parse(contents));
    eleventyConfig.addDataExtension("yml", (contents) => YAML.parse(contents));

    eleventyConfig.addShortcode("asset", function(filename) {
        if (this.page.url.startsWith("/posts/")) {
            return `/assets/posts/${this.page.fileSlug}/${filename}`;
        }
        return `/assets/pages/${this.page.fileSlug}/${filename}`;
    })

    eleventyConfig.addShortcode("codepen", function(user, id, modalID, fullname, pentitle) {
        return `<div class="codepen-modal modal hide-modal" id="${modalID}" data-drag="false"><div class="modal-header"><button class="close-btn" data-close-target="${modalID}"></button><div class="drag-bar" data-drag-target="${modalID}"><hr></div></div><div class="modal-content"><iframe height="600" style="width: 800px;" scrolling="no" src="https://codepen.io/${user}/embed/${id}?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true">See the Pen <a href="https://codepen.io/${user}/pen/${id}">${pentitle}</a> by ${fullname} (<a href="https://codepen.io/${user}">@${user}</a>) on <a href="https://codepen.io">CodePen</a>.</iframe></div></div>`
    })

    eleventyConfig.addPairedShortcode("comments", function(url){
        return `<div class="modal hide-modal" id="comments-modal" data-drag="false"><div class="modal-header"><button class="close-btn" data-close-target="comments-modal">✕</button><div class="drag-bar" data-drag-target="comments-modal"><hr></div></div><div class="modal-content"><iframe class="comments_frame" style="width: 500px; height: 600px;" src="${url}"></iframe></div></div>`
    })

    eleventyConfig.addShortcode("modalBtn", function(modalID, text) {
        return `<button class="open-btn" data-open-target="${modalID}">${text}</button>`
    })

    const mdoptions = {
        html: true,
        breaks: true,
        linkify: true,
    };
    const markdownLib = markdownIt(mdoptions).use(markdownItBracketedSpans).use(markdownItAttrs, {
        leftDelimiter: '{',
        rightDelimiter: '}',
        allowedAttributes: []
    }).use(footnote).use(container, {
        name: "embed-modal"
    });

    eleventyConfig.setLibrary("md", markdownLib)

    eleventyConfig.addFilter("shortDate", (dateObj) => {
        return DateTime
        .fromJSDate(dateObj, {zone: "utc"})
        .toFormat("LLL dd yyyy");
    })
    eleventyConfig.addFilter("where", function(array, key, value) {
        return array.filter(item => item[key] === value);
    })

    eleventyConfig.addPlugin(feedPlugin, {
        type: "atom",
        outputPath: "/feed.xml",
        collection: {
            name: "posts",
            limit: 0,
            sort: "descending"
        },
        metadata: {
            language: "en",
            title: "Megan Renae",
            subtitle: "Writer, Developer, Storyteller",
            base: "https://meganrenae.me",
            author: {
                name: "Megan Renae"
            }
        }
    })

    eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
        if(data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
            return false;
        }
    })
}