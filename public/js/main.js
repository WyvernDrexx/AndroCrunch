window.onload = function () {
  $('.srch-btn').click(function () {
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
  $(document).on("keydown", "form", function (event) {
    return event.key != "Enter";
  });
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
      } else {
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
    $(".card-body").addClass("px-4");
  }
  var itemsMainDiv = ('.MultiCarousel');
  var itemsDiv = ('.MultiCarousel-inner');
  var itemWidth = "";

  $('.leftLst, .rightLst').click(function () {
    var condition = $(this).hasClass("leftLst");
    var over = $(this).hasClass(".leftLst.over");
    if (condition && !over)
      click(0, this);
    else
      click(1, this)
  });

  ResCarouselSize();

  $(window).resize(function () {
    ResCarouselSize();
  });

  //this function define the size of the items
  function ResCarouselSize() {
    var incno = 0;
    var dataItems = ("data-items");
    var itemClass = ('.item');
    var id = 0;
    var btnParentSb = '';
    var itemsSplit = '';
    var sampwidth = $(itemsMainDiv).width();
    var bodyWidth = $('body').width();
    $(itemsDiv).each(function () {
      id = id + 1;
      var itemNumbers = $(this).find(itemClass).length;
      btnParentSb = $(this).parent().attr(dataItems);
      itemsSplit = btnParentSb.split(',');
      $(this).parent().attr("id", "MultiCarousel" + id);
      if (bodyWidth >= 576) {
        incno = itemsSplit[1];
        itemWidth = sampwidth / incno - 7;
      } else {
        incno = itemsSplit[0];
        itemWidth = sampwidth / incno - 7;
      }
      $(this).css({
        'transform': 'translateX(0px)',
        'width': itemWidth * itemNumbers
      });

      //-------------
      var widthItem = 0;
      $(this).find(itemClass).each(function () {
        $(this).outerWidth(itemWidth);
      });
      widthItem = $(".pad15").innerWidth();
      $(".item-info").outerWidth(widthItem);
      $(".leftLst").addClass("over");
      $(".rightLst").removeClass("over");
    });
  }


  //this function used to move the items
  function ResCarousel(e, el, s) {
    var itemsDiv = ('.MultiCarousel-inner');
    var leftBtn = ('.leftLst');
    var rightBtn = ('.rightLst');
    var translateXval = '';
    var divStyle = $(el + ' ' + itemsDiv).css('transform');
    var values = divStyle.match(/-?[\d\.]+/g);
    var xds = Math.abs(values[4]);
    if (e == 0) {
      translateXval = parseInt(xds) - parseInt(itemWidth * s);
      $(el + ' ' + rightBtn).removeClass("over");
      if (translateXval <= itemWidth / 2) {
        translateXval = 0;
        $(el + ' ' + leftBtn).addClass("over");

      }
    } else if (e == 1) {
      var itemsCondition = $(el).find(itemsDiv).width() - $(el).width();
      translateXval = parseInt(xds) + parseInt(itemWidth * s);
      $(el + ' ' + leftBtn).removeClass("over");

      if (translateXval >= itemsCondition - itemWidth / 2) {
        translateXval = itemsCondition;
        $(el + ' ' + rightBtn).addClass("over");
        $(".fade-on").css("display", "none");
      }
    }
    $(el + ' ' + itemsDiv).css('transform', 'translateX(' + -translateXval + 'px)');
  }

  //It is used to get some elements from btn
  function click(ell, ee) {
    var Parent = "#" + $(ee).parent().attr("id");
    var slide = $(Parent).attr("data-slide");
    ResCarousel(ell, Parent, slide);
  }

  setInterval(() => {
    $(".right-move").trigger("click");
  }, 3000);



  // $(document).on('scroll', function() {
  //   if( $(this).scrollTop() >= $('.MultiCarousel').offset().top ){

  //   }
  // });

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

// When the user clicks on the button, scroll to the top of the document
// function topFunction() {
//   document.body.scrollTop = 0; // For Safari
//   document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
// } e window s