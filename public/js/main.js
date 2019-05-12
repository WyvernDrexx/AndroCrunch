window.onload = function () {
  $('.srch-btn').click(function(){
    $(this).parent().toggleClass('open');
  });
  var nav = document.getElementById("nav");
  var op = true;
  var offset = window.pageYOffset;
  if (offset > 50) {
    nav.style.backgroundColor = "#ededee";
    $(".nav-link").addClass("text-dark-purple");
    $(".navbar-brand").addClass("text-dark-purple");
    document.getElementById("side-toggler").style.backgroundColor = "#ededee";
  } else {
    nav.style.backgroundColor = "transparent";
    document.getElementById("side-toggler").style.backgroundColor = "transparent";
  }

  window.addEventListener("scroll", () => {
    var offset = window.pageYOffset;
    if (offset > 50) {
      nav.style.backgroundColor = "#ededee";
      $(".nav-link").addClass("text-dark-purple");
      $(".navbar-brand").addClass("text-dark-purple");
      document.getElementById("side-toggler").style.backgroundColor = "#ededee";
    } else if (op) {
      nav.style.backgroundColor = "transparent";
      $(".nav-link").removeClass("text-dark-purple");
      $(".navbar-brand").removeClass("text-dark-purple");
      document.getElementById("side-toggler").style.backgroundColor = "transparent";
    }
  });

  nav.addEventListener("click", () => {
    if (op) {
      op = false;
    } else {
      op = true;
    }
  });

  $("body").css("opacity", "1");
  $(".loader-div").remove();
}

$(document).ready(function () {

  window.subscribe = function () {
    let email = $(".subscription input[name=email]").val();
    $(".spinner-border.spinner-border-sm").removeClass("d-none");
    $.ajax("/subscribe", {
      method: "POST",
      data: {
        email: email
      }
    }).done(data => {
      $(".spinner-border.spinner-border-sm").addClass("d-none");
      if (!data.status) {
        $(".subscription button").css("background-color", "#d42323");
        $(".subscription input[name=email]").val("");
        $(".subscription input[name=email]").attr("placeholder", data.message);
      }else{
        $(".subscription button").css("background-color", "rgb(3, 131, 182)");
        $(".subscription input[name=email]").attr("placeholder", data.message);
        $(".subscription input[name=email]").val("");
      }
    });
  }


  $.fn.isOnScreen = function () {

    var win = $(window);

    var viewport = {
      top: win.scrollTop() - 150,
      left: win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();

    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();

    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

  };
  let statsFlag = false;

  $.fn.exists = function () {
    return this.length !== 0;
  }
  if ($("#stats").exists()) {
    $(window).scroll(function () {
      if ($('#stats').isOnScreen() && !statsFlag) {
        // $("#downloads").html("Got it!");
        statsFlag = true;
        // setInterval(() => {
        //   let fill = false;
        //   if()
        // }, 1000);
        setTimeout(() => {
          $('#downloads').each(function () {
            $(this).prop('Counter', 0).animate({
              Counter: $(this).text()
            }, {
              duration: 4000,
              easing: 'swing',
              step: function (now) {
                $(this).text(Math.ceil(now));
              }
            });
          });
        }, 100);
        setTimeout(() => {
          $('#premium-stuffs').each(function () {
            $(this).prop('Counter', 0).animate({
              Counter: $(this).text()
            }, {
              duration: 4000,
              easing: 'swing',
              step: function (now) {
                $(this).text(Math.ceil(now));
              }
            });
          });
        }, 100);
        setTimeout(() => {
          $('#notify-squad').each(function () {
            $(this).prop('Counter', 0).animate({
              Counter: $(this).text()
            }, {
              duration: 4000,
              easing: 'swing',
              step: function (now) {
                $(this).text(Math.ceil(now));
              }
            });
          });
        }, 100);
      } else {
        // The element is NOT visible, do something else
      }
    });
  }

  if (window.innerWidth < 576 && $(".subscribe").exists()) {
    $(".subscribe").removeClass("main-content");
    $(".trending-posts").remove();
  }

  
});


/* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "80vw";
  document.getElementById("sidenavs").style.display = "none";
  $("#side-toggler .closebtn").css("display", "block");
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  $("#side-toggler .closebtn").css("display", "none");
  document.getElementById("sidenavs").style.display = "inline-block";
}

// window.onscroll = function() {scrollFunction()};

// function scrollFunction() {
//   if (document.body.scrBollTop > 20 || document.documentElement.scrollTop > 20) {
//     document.getElementyId("myBtn").style.display = "block";
//   } else {
//     document.getElementById("myBtn").style.display = "none";
//   }
// }
var amountScrolled = 1000;

$(window).scroll(function () {
  if ($(window).scrollTop() > amountScrolled) {
    $('#myBtn').fadeIn('slow');
  } else {
    $('#myBtn').fadeOut('slow');
  }
});
// ccccff

$('#myBtn').click(function () {
  $('html, body').animate({
    scrollTop: 0
  }, 700);
  return false;
});
$(document).ready(function () {
  $('#take-a-tour').click(function () {
    $('html, body').animate({
      scrollTop: $(document).height()
    }, 8000, 'swing');
    return false;
  });

});
