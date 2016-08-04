var kissanime = require('./kissanime-connection');

/************************ Kissanime Class Declaration ****************************/
module.exports = class Kissanime {
    static syncSpawnMsg() {
        console.log("WARNING: Unable to spawn asynchronous process:\n\tParent not ready.");
    }

    test() {
        if (kissanime.ready && !kissanime.busy) {
            kissanime.testSearch();
        } else if (!kissanime.ready && !kissanime.busy) {
            // Synchronization Error has occurred.
            Kissanime.syncSpawnMsg();
        } else {
            console.log(this.busyMsg.red);
        }
    }

    search(item) {
        if (kissanime.ready && !kissanime.busy) {
            kissanime.search(item);
        } else if (!kissanime.ready && !kissanime.busy) {
            // Synchronization Error has occurred.
            Kissanime.syncSpawnMsg();
        } else {
            console.log(this.busyMsg.red);
        }
    }

    changeTest(newTerm) {
        if (kissanime.ready && !kissanime.busy) {
            kissanime.changeSearchTest(newTerm);
        } else if (!kissanime.ready && !kissanime.busy) {
            Kissanime.syncSpawnMsg();
        } else {
            console.log(this.busyMsg.red);
        }
    }

    getConnection() {
      return kissanime;
    }

    getSearchResults() {
      return kissanime.searchResults;
    }

    getRawVideoPage(url) {
        if (kissanime.ready && !kissanime.busy) {
            kissanime.getAnimePage(url);
        } else if (!kissanime.ready && !kissanime.busy) {
            Kissanime.syncSpawnMsg();
        } else {
            console.log(busyMsg.red);
        }
    }

    getEpisodeList(url) {
        if (kissanime.ready && !kissanime.busy) {
            kissanime.getEpisodeListing(url);
        } else if (!kissanime.ready && !kissanime.busy) {
            Kissanime.syncSpawnMsg();
        } else {
            console.log(this.busyMsg.red);
        }
    }

    getVideo(rawURI) {
      
    }

    static wait(callback) {
        if (kissanime.busy) {
            setTimeout(Kissanime.wait, 100, callback);
        } else {
            callback();
        }
    }

    constructor() {
        this.enable = true;
        this.busyMsg = "SKIPPED: Kissanime Busy (Try using Kissanime.wait())";
    }
}
