function divCodeBlock(pre) {
    const wrapper = document.createElement("div")
    wrapper.classList.add("codeblock")

    if (pre.dataset.language) {
        wrapper.dataset.language = pre.dataset.language
    }

    pre.parentNode.insertBefore(wrapper, pre)
    wrapper.appendChild(pre)
}

export function preLabels(){

    const languageNames = {
        js: 'JavaScript',
        javascript: 'JavaScript',
        html: 'HTML',
        css: 'CSS',
        scss: 'SCSS',
        bash: 'Bash',
        shell: 'Shell',
        json: 'JSON',
        yaml: 'YAML',
        yml: 'YAML',
        njk: 'Nunjucks',
        liquid: 'Liquid',
        md: 'Markdown',
        php: 'PHP',
        py: 'Python',
        ts: 'TypeScript',
        sql: 'SQL',
        toml: 'TOML',
        latex: 'LaTeX'
        };

    const codeblocks = document.querySelectorAll("pre > code")

    codeblocks.forEach((block) => {
        let pre = block.parentElement;
        let cls = [...block.classList].find(c => 
            c.startsWith('language-')
        );

        if (!cls) return;

        const lang = cls.replace('language-', '')

        pre.dataset.language = languageNames[lang] || lang.charAt(0).toUpperCase() + lang.slice(1)

        divCodeBlock(pre)
    })
}

