export function initDraggableModals() {
    const modals = document.querySelectorAll(".modal")

    modals.forEach(modal => {
        const id = modal.id;

        const openBtn = document.querySelector(`[data-open-target="${id}"]`)
        const closeBtn = document.querySelector(`[data-close-target="${id}"]`)
        const modalHeader = document.querySelector(`[data-drag-target="${id}"]`)

        let offsetX;
        let offsetY;
        
        openBtn.addEventListener("click", function(){
            modal.classList.remove("hide-modal")
            modal.classList.add("show-modal")
            modal.style.top = "100px"
            modal.style.left = "100px"
        })
        closeBtn.addEventListener("click", function(){
            modal.classList.remove("show-modal")
            modal.classList.add("hide-modal")
        })

        modalHeader.addEventListener("pointerdown", function(event){
            modal.dataset.drag = "true"
            const rect = modal.getBoundingClientRect()

            offsetX = event.clientX - rect.left;
            offsetY = event.clientY - rect.top

            modalHeader.setPointerCapture(event.pointerId);
        })
        modalHeader.addEventListener("pointermove", function(event){
            if (modal.dataset.drag == "false") return
            modal.style.left = `${event.clientX - offsetX}px`
            modal.style.top = `${event.clientY - offsetY}px`
        })
        modalHeader.addEventListener("pointerup", function(){
            modal.dataset.drag = "false"
        })
    })
}
