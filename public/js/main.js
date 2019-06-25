function openNav() {
    document.getElementById("mySidenav").style.width = "80vw", document.getElementById("sidenavs").style.display = "none", $("#side-toggler .closebtn").css("display", "block")
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0", $("#side-toggler .closebtn").css("display", "none"), document.getElementById("sidenavs").style.display = "inline-block"
}
window.onload = function () {


    // TAKE A TOUR BUTTON
    window.scrollDown = function scrollDown() {
        $("html, body").animate({
            scrollTop:$("#about").offset().top - 55
        }, 5000);
    }



    $(".srch-btn").click(function () {
        $(this).parent().toggleClass("open")
    });
    var e = document.getElementById("nav"),
        t = !0;
    window.pageYOffset > 50 ? (e.style.backgroundColor = "#ededee", $(".nav-link").addClass("text-dark-purple"), $(".navbar-brand").addClass("text-dark-purple"), document.getElementById("side-toggler").style.backgroundColor = "#ededee") : (e.style.backgroundColor = "transparent", document.getElementById("side-toggler").style.backgroundColor = "transparent"), window.addEventListener("scroll", () => {
        window.pageYOffset > 50 ? (e.style.backgroundColor = "#ededee", $(".nav-link").addClass("text-dark-purple"), $(".navbar-brand").addClass("text-dark-purple"), document.getElementById("side-toggler").style.backgroundColor = "#ededee") : t && (e.style.backgroundColor = "transparent", $(".nav-link").removeClass("text-dark-purple"), $(".navbar-brand").removeClass("text-dark-purple"), document.getElementById("side-toggler").style.backgroundColor = "transparent")
    }), e.addEventListener("click", () => {
        t = !t
    }), $("body").css("opacity", "1"), $(".loader-div").remove()
}, $(document).ready(function () {
    $("body").css("opacity", "1"), $(".loader-div").remove(), window.subscribe = function () {
        let e = $(".subscription input[name=email]").val();
        $(".subscribe .spinner-border.spinner-border-sm").removeClass("d-none"), $.ajax("/subscribe", {
            method: "POST",
            data: {
                email: e
            }
        }).done(e => {
            $(".subscribe .spinner-border.spinner-border-sm").addClass("d-none"), e.status ? ($(".subscription button").css("background-color", "rgb(3, 131, 182)"), $(".subscription input[name=email]").attr("placeholder", e.message), $(".subscription input[name=email]").val("")) : ($(".subscription button").css("background-color", "#d42323"), $(".subscription input[name=email]").val(""), $(".subscription input[name=email]").attr("placeholder", e.message))
        })
    }, $.fn.isOnScreen = function () {
        var e = $(window),
            t = {
                top: e.scrollTop() - 150,
                left: e.scrollLeft()
            };
        t.right = t.left + e.width(), t.bottom = t.top + e.height();
        var n = this.offset();
        return n.right = n.left + this.outerWidth(), n.bottom = n.top + this.outerHeight(), !(t.right < n.left || t.left > n.right || t.bottom < n.top || t.top > n.bottom)
    };
    let e = !1;
    $.fn.exists = function () {
        return 0 !== this.length
    }, $("#stats").exists() && $(window).scroll(function () {
        $("#stats").isOnScreen() && !e && (e = !0, setTimeout(() => {
            $("#downloads").each(function () {
                $(this).prop("Counter", 0).animate({
                    Counter: $(this).text()
                }, {
                    duration: 4e3,
                    easing: "swing",
                    step: function (e) {
                        $(this).text(Math.ceil(e))
                    }
                })
            })
        }, 100), setTimeout(() => {
            $("#premium-stuffs").each(function () {
                $(this).prop("Counter", 0).animate({
                    Counter: $(this).text()
                }, {
                    duration: 4e3,
                    easing: "swing",
                    step: function (e) {
                        $(this).text(Math.ceil(e))
                    }
                })
            })
        }, 100), setTimeout(() => {
            $("#notify-squad").each(function () {
                $(this).prop("Counter", 0).animate({
                    Counter: $(this).text()
                }, {
                    duration: 4e3,
                    easing: "swing",
                    step: function (e) {
                        $(this).text(Math.ceil(e))
                    }
                })
            })
        }, 100))
    }), window.innerWidth < 576 && $(".subscribe").exists() && ($(".subscribe").removeClass("main-content"), $(".trending-posts").remove())
});
var amountScrolled = 1e3;
$(window).scroll(function () {
    $(window).scrollTop() > amountScrolled ? $("#myBtn").fadeIn("slow") : $("#myBtn").fadeOut("slow")
}), $("#myBtn").click(function () {
    return $("html, body").animate({
        scrollTop: 0
    }, 700), !1
}), $(document).ready(function () {
    $("#take-a-tour").click(function () {
        return $("html, body").animate({
            scrollTop: $(document).height()
        }, 8e3, "swing"), !1
    })
}), $("input").on("keyup keypress", function (e) {
    if (13 === (e.keyCode || e.which)) return e.preventDefault(), !1
}), $("input[type=file]").change(function () {
    var e = $(this).val();
    null == (e = e.replace("C:\\fakepath\\", "")) && "" == e || ($(this).next(".custom-file-label").attr("data-content", e), $(this).next(".custom-file-label").text(e))
});