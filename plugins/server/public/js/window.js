var userAgent = window.navigator.userAgent.toLowerCase();
var ios = /iphone|ipod|ipad/.test(userAgent);
var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;


var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};



window.addEventListener("resize", function() {

    h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (isMobile.any()) {
        if (document.getElementById("li") != null)
            document.getElementById("li").style.fontSize = "500%";
        if (document.getElementById("nav") != null)
            document.getElementById("nav").style.fontSize = "300%";
    }
    if (w < 700) {
        if (document.getElementById("li") != null)
            document.getElementById("li").style.fontSize = "100%";
        if (document.getElementById("p3") != null)
            document.getElementById("p3").style.fontSize = "75%";
    } else if (w > 700) {
        if (document.getElementById("li") != null)
            document.getElementById("li").style.fontSize = "125%";
    }

});

function loaded() {

    var nav = document.getElementById("nav");
    var pthree = document.getElementById("p3");
    var li = document.getElementById("li");
    var fnthandle = document.getElementById("fnt-handle");
    var maidchan = document.getElementById("maidchan");
    var term = document.getElementById("term");
    var guild = document.getElementById("gname");
    var gicon = document.getElementById("gicon");
    var termtop;
    var servers = document.getElementById("select");
    var psort = document.getElementById("sorttop");
    var td = document.getElementById("td");
    var th = document.getElementById("th");
    var colmid = document.getElementById("col_mid");

    if (isMobile.any()) {
        if (colmid != null)
        {
          colmid.style.width = "";
          colmid.style.cssFloat = "";
        }

        if (psort != null) {
            psort.style.fontSize = "12px";
        }
        if (servers != null) {
            servers.style.fontSize = "52px";
            servers.style.height = "100px";
            servers.style.width = "600px"
        }
        if (li != null)
            document.getElementById("li").style.fontSize = "500%";
        if (nav != null) {
            document.getElementById("nav").style.fontSize = "300%";
        }
        if (fnthandle != null)
            document.getElementById("fnt-handle").style.fontSize = "300%";
        if (maidchan != null)
            document.getElementById("maidchan").style.width = "60%";
        if (term != null)
            term.style.fontSize = "250%";
        if (guild != null)
            guild.style.fontSize = "300%";
        if (td != null)
            td.style.fontSize = "24px";
        if (th != null)
            th.style.fontSize = "28px";
    } else {
        if (w < 700) {
            if (li != null)
                document.getElementById("li").style.fontSize = "100%";
        } else if (w > 700) {
            if (li != null)
                document.getElementById("li").style.fontSize = "125%";

            if (pthree != null)
                document.getElementById("p3").style.fontSize = "125%";

            if (document.getElementById("H3") != null)
                document.getElementById("H3").style.fontSize = "125%";
        }
    }
}

function addFunc() {

}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("User").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(e) {
    if (!e.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var d = 0; d < dropdowns.length; d++) {
            var openDropdown = dropdowns[d];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}
