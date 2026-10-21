export function termCommands(){
    const links = document.querySelectorAll("a")
    links.forEach(function(link){
        let command;
        let cmdAdded = false;
        const prompt = document.querySelector("#prompt-entry")
        link.addEventListener("mouseover", function(){
            
            const url = new URL(link.href)
            if (url.origin !== window.location.origin) {
                command = `goto ${url.hostname}`
            }
            else if (url.pathname === "/blog") {
                command = `ls posts`
            } 
            else if (url.pathname === "/tags") {
                command = `ls tags`
            }
            else if (url.pathname.startsWith("/posts/")) {
                command = `read ${url.pathname.slice(7)}`
            }
            else if (url.pathname.startsWith("/tags/")) {
                let tag = url.pathname.slice(6)
                command = `ls posts --${tag}`
            }
            else {
                command = `open ${url.pathname}`
            }
            cmdAdded = true
            prompt.textContent = command
        })
       link.addEventListener("mouseout", function(){
            prompt.textContent = ""
       })
       link.addEventListener("click", function(){
            if (!cmdAdded) return;
            sessionStorage.setItem(
                "lastCommand",
                command
            )
       })
    })
}

export function getCommand(){
    const command = sessionStorage.getItem("lastCommand")
    const termlog = document.querySelector(".term-log-old .entry")
    if (!command) {
        termlog.textContent = "run"
        return
    }
    termlog.textContent = command
}