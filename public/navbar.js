var scrollEventHandler = function() {
    if(scrollY >= 105) {
        if(!document.getElementById("heading-nav-scrolled")) {
            var head = document.getElementById("heading-nav");
            var clone = head.cloneNode(true);
            clone.id = "heading-nav-scrolled";
            clone.classList.add("slideDown");
            clone.classList.add("bottom-shadow");
            document.body.insertBefore(clone, head);
        }
    } else {
        document.getElementById("heading-nav-scrolled").remove();
    }
}

window.addEventListener("scroll", scrollEventHandler);