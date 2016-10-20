var domainLocation = function () {
    return `${window.location.protocol}//${window.location.host}`;
};
if (document.getElementById("discord-img") != null)
    document.getElementById("discord-img").src = screen.width > 1024 ? `${domainLocation()}/images/discord.png` : '';

$(document).ready(function() {
    $('#playlist').DataTable();
})