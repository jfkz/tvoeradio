register_namespace('player.station.album');


player.station.album.add_to_playlist = function(callback) {
    var parsed = /^(.+)\s\((.+)\)$/.exec(player.station.name);
    var album = parsed[1];
    var artist = parsed[2];
    if (player.playlist.list.length) {
        return 'no_more_tracks';
    }
    network.lastfm.api('album.getInfo', {'artist': artist, 'album': album, 'lang': 'ru'}, function(data) {
        player.playlist.add_tracks(
            network.lastfm.arrayize(data.album.tracks.track),
            callback,
            {
                album_cover: network.lastfm.select_image(data.album.image, 'large'),
                album_name: album,
                album_artist: artist
            }
        );
    });
};


player.station.album.get_html = function(name) {
    var parsed = /^(.+)\s\((.+)\)$/.exec(name);
    var album = parsed[1];
    var artist = parsed[2];
    return 'альбом <b>' + util.string.htmlspecialchars(album) + '</b> от <b>' + util.string.htmlspecialchars(artist) + '</b>';
};

player.station.album.include_remixes = true;
