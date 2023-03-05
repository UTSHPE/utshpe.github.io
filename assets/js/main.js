$(document).ready( function() {
    $('.event-flyer').click( function() {
        this.requestFullscreen();
    });
});

function reveal() {
    var reveal_l = document.querySelectorAll(".reveal-left");
    var reveal_r = document.querySelectorAll(".reveal-right");
    for (var i = 0; i < reveal_l.length; i++) {
      var windowHeight = window.innerHeight;
      var elementTop = reveal_l[i].getBoundingClientRect().top;
      var elementVisible = 150;
      if (elementTop < windowHeight - elementVisible) {
        reveal_l[i].classList.add("active");
      } else {
        reveal_l[i].classList.remove("active");
      }
    }

    for (var i = 0; i < reveal_r.length; i++) {
      var windowHeight = window.innerHeight;
      var elementTop = reveal_r[i].getBoundingClientRect().top;
      var elementVisible = 150;
      if (elementTop < windowHeight - elementVisible) {
        reveal_r[i].classList.add("active");
      } else {
        reveal_r[i].classList.remove("active");
      }
    }
}

window.addEventListener("scroll", reveal);

function myFunction(imgs) {
  // Get the expanded image
  var expandImg = document.getElementById("expandedImg");
  // Get the image text
  var imgText = document.getElementById("imgtext");
  // Use the same src in the expanded image as the image being clicked on from the grid
  expandImg.src = imgs.src;
  // Use the value of the alt attribute of the clickable image as text inside the expanded image
  imgText.innerHTML = imgs.alt;
  // Show the container element (hidden with CSS)
  expandImg.parentElement.style.display = "block";
}
