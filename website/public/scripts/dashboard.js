function a(t) {
    $().slimScroll && $(t).each(function() {
        if (!$(this).attr("data-initialized")) {
            var t;
            t = $(this).attr("data-height") ? $(this).attr("data-height") : $(this).css("height"),
            $(this).slimScroll({
                allowPageScroll: !0,
                size: "7px",
                color: $(this).attr("data-handle-color") ? $(this).attr("data-handle-color") : "#bbb",
                wrapperClass: $(this).attr("data-wrapper-class") ? $(this).attr("data-wrapper-class") : "slimScrollDiv",
                railColor: $(this).attr("data-rail-color") ? $(this).attr("data-rail-color") : "#eaeaea",
                position: e ? "left" : "right",
                height: t,
                alwaysVisible: "1" == $(this).attr("data-always-visible"),
                railVisible: "1" == $(this).attr("data-rail-visible"),
                disableFadeOut: !0
            }),
            $(this).attr("data-initialized", "1")
        }
    })
}
a(".scroller");