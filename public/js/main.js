window.onload = function () {
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

}

$(document).ready(function () {
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
        itemWidth = sampwidth / incno -7;
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
  document.getElementById("mySidenav").style.width = "100vw";
  document.getElementById("sidenavs").style.display = "none";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("sidenavs").style.display = "inline-block";
}

// window.onscroll = function() {scrollFunction()};

// function scrollFunction() {
//   if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
//     document.getElementById("myBtn").style.display = "block";
//   } else {
//     document.getElementById("myBtn").style.display = "none";
//   }
// }
var amountScrolled = 300;

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
$(document).ready(function() {
  $('#take-a-tour').click(function(){
      $('html, body').animate({scrollTop:$(document).height()}, 10000, 'swing');
      return false;
  });

});
var page = $("html, body");
$(document).on('mousemove', function() {
    page.stop();
});
// When the user clicks on the button, scroll to the top of the document
// function topFunction() {
//   document.body.scrollTop = 0; // For Safari
//   document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
// } e window s