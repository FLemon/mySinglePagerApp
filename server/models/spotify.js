function Spotify() {}

Spotify.prototype.addTrack = function(api, trackId, callback) {
  api.addTracksToPlaylist('flemon1986', '7Mw3QnwdLAjy9xMTuPvhoH', [trackId])
    .then(function(data) {
      console.log("data: " + data)
    }, function(err) {
      console.log("err: " + data)
      callback('https://accounts.spotify.com/en/login?client_id=8a844fff820249f89c08fb967471b770&response_type=code&redirect_uri=http:%2F%2F127.0.0.1:5000%2Fauth%2Fspotify%2Fcallback&scope=playlist-modify-public&state=undefined')
    });
};

Spotify.prototype.tracks = function(api, callback) {
  api.getPlaylistTracks('flemon1986', '7Mw3QnwdLAjy9xMTuPvhoH')
    .then(function(data) {
      callback(data.body.items.map(function(item) { return item.track.name }))
    }, function(err) {
      console.log('Something went wrong!', err);
    });
};

module.exports = Spotify;
