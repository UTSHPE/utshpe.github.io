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

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("demo");
  let captionText = document.getElementById("caption");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  captionText.innerHTML = dots[slideIndex-1].alt;
}
