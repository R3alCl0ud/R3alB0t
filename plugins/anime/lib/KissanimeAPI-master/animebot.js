var Kissanime = require('./kissanime');
var kanime = new Kissanime();

kanime.getConnection().isReadyState.on('ready', function() {
    // Inistantiate a new 'Kissanime' object
    var animes;

    kanime.search("vampire");

    Kissanime.wait(function() {
        animes = kanime.getSearchResults();
        Object.keys(animes).forEach(function (anime) {
            Kissanime.wait(function() {
                kanime.getEpisodeList(animes[anime]);
            });
        });
    });

    // Performs a test search and displays results.
    Kissanime.wait(function() {
        kanime.test();
    });
});
