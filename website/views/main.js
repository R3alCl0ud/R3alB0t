var React = require('react');
var ReactDOM = require('react-dom');
let Layout = require('./layout');
var Navigator = require('../lib/navHelper');

function getChildren(Element) {
    if (Element === undefined) return;

    var myChilds = [];
    var Attributes = {};
    for (var i = 0; i < Element.children.length; i++)
        myChilds.push(getChildren(Element.children[i]));
    for (var i = 0; i < Element.attributes.length; i++) {
        if (Element.attributes[i].name === "class")
            Attributes.className = Element.attributes[i].value
        else
            Attributes[Element.attributes[i].name] = Element.attributes[i].value;
    }
    Attributes.children = myChilds;

    if (Element.children.length == 0 && Element.tagName !== "IMG")
        return React.createElement(Element.tagName.toLowerCase(), Attributes, Element.innerHTML)
    else
        return React.createElement(Element.tagName.toLowerCase(), Attributes)
}

function loadScroll(t) {
    var e = !1;
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

module.exports = function (data, containerId, children) {
    var AppRoot = document.getElementById('app-root');
    var toDelete = document.getElementById('deleteThis');
    // const UI = Navigator.userNav(data.user ? data.user : null, data.page)
    console.log(`containerId: ${containerId}`)
    console.log(data)
    var Childs = getChildren(AppRoot);
    ReactDOM.render(<Layout {...data}/>, AppRoot);
    $(document).ready(function(){
        loadScroll(".scroller");
    });
        document.body.removeChild(toDelete);
};
