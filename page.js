document.addEventListener("DOMContentLoaded", function() {
    const iconBoxes = document.querySelectorAll(".icon-box");

    iconBoxes.forEach(function(box) {
        box.addEventListener("click", function() {
            const target = box.getAttribute("data-target");
            window.location.href = target;
        });
    });
});