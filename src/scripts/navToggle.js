export function toggleNav(){
    const toggles = document.querySelectorAll(".nav-toggle")

    toggles.forEach(function(toggle){
        toggle.addEventListener("click", function(){
            let target = toggle.dataset.toggle
            let menu = document.querySelector(`#${target}`)
            if (menu.classList.contains("mobile-hide-children")) {
                menu.classList.remove("mobile-hide-children")
                return
            }
            menu.classList.add("mobile-hide-children")
        })
    })
}