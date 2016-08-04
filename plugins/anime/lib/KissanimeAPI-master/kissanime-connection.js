var request = require('request');
var url = require('url');
var parseString = require('xml2js').parseString;
var colors = require('colors');
var events = require('events');
var htmlparser = require('htmlparser');
var cheerio = require('cheerio');

exports.isReadyState = new events.EventEmitter();

var jar = request.jar();

var searchFor = "free";

exports.ready = false;
exports.busy = false;
exports.searchResults = null;

// The 'failure' event, when a failure is emitted, it
// will be picked up by this function.
exports.isReadyState.on('fail', function() {
    // Log that a terrible error has occurred
    console.log("Fatal Error Detected: ABORT\n".red);

    // Abort the program
    process.exit();
});

exports.changeSearchTest = function(newTerm) {
    searchFor = newTerm;
};

if (!String.prototype.splice) {
    /**
     * {JSDoc}
     *
     * The splice() method changes the content of a string by removing a range of
     * characters and/or adding new characters.
     *
     * @this {String}
     * @param {number} start Index at which to start changing the string.
     * @param {number} delCount An integer indicating the number of old chars to remove.
     * @param {string} newSubStr The String that is spliced in.
     * @return {string} A new string with the spliced substring.
     */
    String.prototype.splice = function(start, delCount, newSubStr) {
        return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
    };
}

/*
t variable grabs root address, substitute with https://kissanime.to/
r variable will be set to https://

the r variable is used to cut https:// from https://kissanime.to/
	this results in T being equal to kissanime.to/

next t is set again to remove the forward '/' from the address resulting in the change
	kissanime.to/ => kissanime.to

	T is now equal to kissanime.to
  T.length = 12
*/

var requestData = null;
request({
    uri: "https://kissanime.to/",
    method: 'GET',
    timeout: 10000,
    followRedirect: true,
    maxRedirects: 10,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36'
    },
    jar: jar
}, function(error, response, body) {
    exports.busy = true;
    var lines = body;
    //lines.substring(lines.indexOf("\n") + 1);
    lines = lines.substring(lines.indexOf('\n') + 1);
    var insertTxt = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n";
    lines = lines.splice(0, 0, insertTxt);
    lines = lines.split('\n');
    lines.splice(33, 1);
    lines = lines.join('\n');
    try {
        parseString(lines, function(err, result) {
            console.log("Attempting to grab correct JavaScript String. . .".green);
            var jsdata = result.html.head[0].script[0]._;
            console.log("\tData Grabbed Successfully!".white);
            console.log("Attempting to grab hidden form data. . .".green);
            var formdata = {
                method: result.html.body[0].div[0].div[1].div[1].div[0].form[0].$.method,
                url: result.html.body[0].div[0].div[1].div[1].div[0].form[0].$.action,
                name: [
                    result.html.body[0].div[0].div[1].div[1].div[0].form[0].input[0].$.name,
                    result.html.body[0].div[0].div[1].div[1].div[0].form[0].input[1].$.name,
                    result.html.body[0].div[0].div[1].div[1].div[0].form[0].input[2].$.name
                ],
                value: [
                    result.html.body[0].div[0].div[1].div[1].div[0].form[0].input[0].$.value,
                    result.html.body[0].div[0].div[1].div[1].div[0].form[0].input[1].$.value,
                    12 // this is from the previosly done calculation based on the JavaScript code
                ]
            };
            console.log("\tHidden Data Grabbed Successfully!".white);
            console.log("Now Attempting to Evaluate the JavaScript String. . .".green);
            var selectedString = jsdata.split('\n')[8].substr(8, jsdata.split('\n')[8].length);
            eval(selectedString);
            var t = '';
            var a = {
                value: null
            };

            // Successful part one execution
            console.log("\t\tPart One Successfully Ran! Now Attempting Part Two. . .".white);
            var selectedStringTwo = jsdata.split('\n')[15].substr(8, jsdata.split('\n')[15].length);
            eval(selectedStringTwo);
            formdata.value[2] += a.value;
            console.log("\t\tPart Two Successfully Ran!".white);
            console.log("\n\tAttempting to Fabricate Request Data. . .\t\t".bgCyan.blue);

            // set value of request data equal to formdata to respond to the server with! :D
            requestData = formdata;

            setTimeout(function() {
                runDataRequest();
            }, 4000);
        });
    } catch (error) {
        console.log("An error has occurred:\n\t".concat(error).red);
    }
});

// This function assumes that both given arguments are arrays.
var dispResults = function(names, links) {
    // Use an index to iterate through both arrays
    for (index = 0; index < names.length; ++index) {
        console.log("\t".concat(index + 1).concat(". ").concat(names[index].green).concat("\n\t\t").concat(links[index].cyan));
    }

    exports.busy = false;
};

exports.search = function(item) {
    // Tell the caller that the kissanime connection is busy.
    exports.busy = true;
    var data;

    // This will return JSON or a string with the error.
    try {
        requestData.url = "https://kissanime.to/Search/SearchSuggest";

        // Pass the cookie Jar to prevent disconnection.
        request({
            uri: requestData.url,
            method: "POST",
            form: {
                type: "Anime",
                keyword: item
            },
            timeout: 10000,
            maxRedirects: 10,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36'
            },
            jar: jar
        }, function(err, resp, body) {
            var lines = body;
            var insertTxt = "<?xml version=\"1.0\" encoding\"UTF-8\" ?>\n<root>";
            lines = lines.splice(0, 0, insertTxt);
            lines = lines.concat("\n</root>");

            // Arrays
            var links = new Array(),
                names = new Array();

            parseString(lines, function(error, result) {
                if (error != null) exports.isReadyState.emit('fail');

                for (anchor in result.root.a) {
                    links.push(result.root.a[anchor].$.href);
                    names.push(result.root.a[anchor]._);
                }

                data = new Object();

                for (name in names) {
                    data[names[name]] = links[name];
                }
                exports.busy = false;
                exports.searchResults = data;
            });
        });
    } catch (error) {
        exports.busy = false;
        exports.searchResults = null;
        return error;
    }
};

exports.testSearch = function() {
    exports.busy = true;
    console.log("Performing a test search. . .");
    requestData.url = "https://kissanime.to/";
    request({
        uri: requestData.url.concat("/Search/SearchSuggest"),
        method: "POST",
        form: {
            type: "Anime",
            keyword: searchFor
        },
        timeout: 10000,
        maxRedirects: 10,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36'
        },
        jar: jar
    }, function(err, resp, bod) {
        var lines = bod;
        var insertTxt = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n";
        var insertTxt2 = "<root>";
        lines = lines.splice(0, 0, insertTxt);
        lines = lines.splice(insertTxt.length, 0, insertTxt2);
        lines = lines.concat("</root>");
        try {
            parseString(lines, function(err, result) {
                var links = new Array(),
                    names = new Array();

                for (anchor in result.root.a) {
                    links.push(result.root.a[anchor].$.href);
                    names.push(result.root.a[anchor]._);
                }

                /* NOW TO DISPLAY RESULTS */
                dispResults(names, links);
                exports.busy = false;
            });
        } catch (error) {
            console.log("Well, what the fuck happened?\n\t".concat(error).red);
            exports.ready = false;
            exports.busy = false;
            exports.isReadyState.emit('fail');
        }
    });
};

exports.dom = undefined;

var handler = new htmlparser.DefaultHandler(function(error, dom) {
    if (error) {
        exports.isReadyState.emit('fail');
    } else {
        exports.dom = dom;
    }
});

exports.getAnimePage = function(url) {
    exports.busy = true;

    console.log("Attempting to grab anime page".green);

    requestData.url = url;
    request({
        uri: requestData.url,
        method: "GET",
        timeout: 10000,
        maxRedirects: 10,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36'
        },
        jar: jar
    }, function(err, resp, body) {
        exports.dom = body;
        exports.busy = false;
    });
};

exports.getEpisodeListing = function(url) {
    exports.busy = true;

    console.log("Attempting to grab anime page".green);

    requestData.url = url;
    request({
        uri: requestData.url,
        method: "GET",
        timeout: 10000,
        maxRedirects: 10,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36'
        },
        jar: jar
    }, function(err, resp, body) {
        $ = cheerio.load(body);
        var listingTable = $('table.listing').html();
        var insertTxt = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<root>";
        listingTable = listingTable.splice(0, 0, insertTxt);
        listingTable = listingTable.concat("</root>");
        try {
            parseString(listingTable, function(e, response) {
                var tlisting = response.root.tr;
                var episodes = [];

                for (i = 2; i < tlisting.length; i++) {
                    episodes.push({
                        name: tlisting[i].td[0].a[0]._.trim(),
                        uri: tlisting[i].td[0].a[0].$.href,
                        aired: tlisting[i].td[1].trim()
                    });
                }
                console.log(JSON.stringify(episodes, null, 4).white);
                exports.busy = false;
            });
        } catch (error) {
            exports.busy = false;
            exports.ready = false;
            exports.isReadyState.emit('fail');
        }
    });
};

/*
This function fabricates the call to the web-site with the fake User-Agent and the generated answer to kissanime's
script. This method then grabs all of the values neccessary to make the request and sends the cookie jar along side
so that all cookies sent and requested can be given and recieve, thus giving me full permission to the site, just
like a client using a browser, I will be able to browse freely, and stream as long it doesn't browse too fast, and
the cookies and fake User-Agent is present at all times. This could possibly be used to even make a plugin to me and
Perry's bot on Discord so that we could request videos from https://www.kissanime.to/ this is as long as the authors of
kissanime don't do too much to change their structures in awakening of my bot requesting videos off of their web
service.
*/
var runDataRequest = function() {
    var data = new Object;
    var data_names = [requestData.name[0], requestData.name[1], requestData.name[2]];
    var data_vals = [requestData.value[0], requestData.value[1], requestData.value[2]];
    data[data_names[0]] = data_vals[0];
    data[data_names[1]] = data_vals[1];
    data[data_names[2]] = data_vals[2];
    requestData.url = "https://kissanime.to".concat(requestData.url).concat("?").concat(requestData.name[0]).concat("=")
        .concat(requestData.value[0]).concat("&").concat(requestData.name[1]).concat("=")
        .concat(requestData.value[1]).concat("&").concat(requestData.name[2])
        .concat("=").concat(requestData.value[2]);
    console.log("Calling To: ".concat(requestData.url).yellow);
    request({
        uri: requestData.url,
        method: requestData.method,
        form: data,
        timeout: 10000,
        followRedirect: true,
        maxRedirects: 10,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36'
        },
        jar: jar
    }, function(error, response, body) {
        if (error === null) {
            console.log("\tSuccess!".white);

            // Emit an event so that listening scripts know that initialization of the script is finished.
            exports.ready = true;
            exports.busy = false;
            exports.isReadyState.emit('ready');
        } else {
            console.log("God Dammit, why now, I was getting to the good part. *sigh*".red);
            exports.ready = false;
            exports.busy = false;
            exports.isReadyState.emit('fail');
        }
    });
};
