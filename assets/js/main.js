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

//code_resources.html copy code function
function copyCode(codeId) {
  const code = document.getElementById(codeId).innerText;
  navigator.clipboard.writeText(code).then(() => {
      alert('Code copied to clipboard!');
  }).catch(err => {
      console.error('Failed to copy code: ', err);
  });
}
